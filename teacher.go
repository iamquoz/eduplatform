package main

// Flop is a test method, it returns a string to check that server is working correctly
func (p *Player) Flop() String {
	return "i am wanted for war crimes in uganda"
}

// Echo is an another test method, it adds 1 to the input and returns it
func (p *Player) Echo(i Int) Int {
	return i + 1
}

// AddStudent creates a new student account with empty password.
func (p *Player) AddStudent(name String) StudentID {
	query := `insert into logins (hash, names, role) values ($1, $2, 1) returning id`
	hash := sesh("")
	row := dbconn.QueryRow(query, hash[:], name)
	var id StudentID
	err := row.Scan(&id)
	if err != nil {
		report(err)
	}
	return id
}

// ZapStudent removes a student from database along with its data
func (p *Player) ZapStudent(u StudentID) {
	// TODO zap data
	qlogin := `delete from logins where id = $1`
	qapp := `delete from appointments where sid = $1`
	_, err := dbconn.Exec(qlogin, u)
	if err != nil {
		report(err)
	}
	_, err = dbconn.Exec(qapp, u)
	if err != nil {
		report(err)
	}
}

// GetStudents returns a list of all students
func (p *Player) GetStudents() MapStudentIDString {
	query := "select id, names from logins where role = 1"
	rows, err := dbconn.Query(query)
	if err != nil {
		report(err)
		return nil
	}
	m := make(MapStudentIDString)
	for rows.Next() {
		var uid StudentID
		var names string
		rows.Scan(&uid, &names)
		m[uid] = names
	}
	return m
}

// NewTask saves task data. Returns -1 on error.
func (p *Player) NewTask(tk Task, thid TheoryID) TaskID {
	var err error
	query := `insert into tasks (data, theoryid) values ($1, $2) returning id`
	tk = *taskfilter(&tk)
	btk, err := task2gob(&tk, nil)
	if err != nil {
		report(err)
		return -1
	}
	row := dbconn.QueryRow(query, btk, thid)
	var id TaskID
	err = row.Scan(&id)
	if err != nil {
		report(err)
	}
	return id
}

// RenewTask updates task data saved under ID. Returns -1 on error.
func (p *Player) RenewTask(taid TaskID, tk Task, thid TheoryID) TaskID {
	var err error
	query := `update tasks set data = $2, theoryid = $3 where id = $1`
	tk = *taskfilter(&tk)
	btk, err := task2gob(&tk, nil)
	if err != nil {
		report(err)
		return -1
	}
	_, err = dbconn.Exec(query, taid, btk, thid)
	if err != nil {
		report(err)
		return -1
	}
	return taid
}

// ZapTask deletes saved task by ID
func (p *Player) ZapTask(tid TaskID) {
	var err error
	query := `delete from tasks where id = $1`
	_, err = dbconn.Exec(query, tid)
	if err != nil {
		report(err)
	}
}

// NewTheory saves theory data on server. Returns -1 on error.
func (p *Player) NewTheory(th Theory) TheoryID {
	bts, err := theory2gob(&th, nil)
	query := `insert into theory data values $1 returning id`
	r := dbconn.QueryRow(query, bts)
	var id TheoryID
	err = r.Scan(&id)
	if err != nil {
		report(err)
		return -1
	}
	return id
}

// RenewTheory updates theory data saved under ID. Returns -1 on error.
func (p *Player) RenewTheory(thid TheoryID, th Theory) TheoryID {
	bts, err := theory2gob(&th, nil)
	query := `update theory set data = $2 where id = $1`
	_, err = dbconn.Exec(query, thid, bts)
	if err != nil {
		report(err)
		return -1
	}
	return thid
}

// ZapTheory deletes saved theory by ID
func (p *Player) ZapTheory(thid TheoryID) {
	query := `delete from theory where id = $1`
	_, err := dbconn.Exec(query, thid)
	if err != nil {
		report(err)
	}
}

// Appoint assigns tasks by ID to students
func (p *Player) Appoint(sida StudentIDArray, tida TaskIDArray, thid TheoryID) {
	query := `insert into appointments (sid, taskid, theoryid) values ($1, $2, $3)`
	for _, sid := range sida {
		for _, tid := range tida {
			_, err := dbconn.Exec(query, sid, tid, thid)
			if err != nil {
				report(err)
				return
			}
		}
	}
}

// GetStats returns stats for a student
func (p *Player) GetStats(sid StudentID) MapTheoryIDStats {
	// select sid, taskid, complete, correct, tries from appointments inner join tasks on tasks.id = appointments.taskid and sid = 2
	query := `select taskid, correct, tries from appointments where sid = $1 and complete = true`
	rows, err := dbconn.Query(query, sid)
	if err != nil {
		report(err)
		return nil
	}
	mm := make(MapTheoryIDStats)
	for id := range p.TheoryNames() {
		// if there are going to be more levels fix it
		total := make([]uint, 3)
		correct := make([]uint, 3)
		var totaltries uint = 0
		for rows.Next() {
			// WILL be ineffective on large scale
			var r bool
			var tid int32
			var tries int32
			rows.Scan(&tid, &r, &tries)
			var compx uint
			{
				query := `select data from tasks where taskid = $1`
				sub := dbconn.QueryRow(query, tid)
				buf := make([]byte, 0, 255)
				err = sub.Scan(buf)
				tk, err := gob2task(buf, err)
				if err != nil {
					report(err)
					return nil
				}
				compx = tk.Difficulty
			}
			// see util.go:65
			{
				if r {
					correct[compx-1]++
				}
				total[compx-1]++
				totaltries += uint(tries)
			}
		}
		mm[id] = Stats{Total: total, Correct: correct, TotalAttempts: totaltries}
	}
	return mm
}

// Unread returns unrated by teacher TaskIDs for each user
func (p *Player) Unread() MapStudentIDArrayTaskID {
	//appointments (sid integer, taskid integer, complete boolean, correct boolean,
	//	rated boolean, tries integer, answer bytea, comment varchar)
	query := `select (sid, taskid) from appointments where rated = false`
	rows, err := dbconn.Query(query)

	m := make(MapStudentIDArrayTaskID)
	for rows.Next() && err == nil {
		var sid StudentID
		var taskid TaskID
		err = rows.Scan(&sid, &taskid)
		if _, k := m[sid]; k {
			m[sid] = append(m[sid], taskid)
		} else {
			// maybe in serious applications this 10 could be coefficient
			// multiplied to total students count
			m[sid] = make([]TaskID, 0, 10)
		}
	}
	if err != nil {
		report(err)
		return nil
	}
	return m
}

func (p *Player) LoadAnswer(sid StudentID, tid TaskID) *Task {
	query := `select data from appointments where sid = $1 and taskid = $2`
	row := dbconn.QueryRow(query, sid, tid)
	buf := make([]byte, 0, 255)
	err := row.Scan(buf)
	tk, err := gob2task(buf, err)
	if err != nil {
		report(err)
		return nil
	}
	return tk
}

func (p *Player) TheoryNames() MapTheoryIDString {
	m := make(MapTheoryIDString)
	q := `select id, data from theory`
	rows, err := dbconn.Query(q)

	for rows.Next() && err == nil {
		var data []byte
		var id int32

		e := rows.Scan(&id, &data)
		th, e := gob2theory(data, e)
		err = e

		if err == nil {
			m[th.ID] = String(th.Header)
		}
	}
	if err != nil {
		report(err)
		return nil
	}
	return m
}

func (p *Player) Rate(sid StudentID, tid TaskID, comment String, correct Bool) {
	// also drop attempts counter since this is manual checked work
	query := `update appointments 
		set rated = $3 
		set correct = $4 
		set tries = 0
		where sid = $1 and taskid = $2`
	_, err := dbconn.Exec(query, sid, tid, comment, correct)
	if err != nil {
		report(err)
	}
}

func (p *Player) EveryTask() MapTaskIDTask {
	m := make(MapTaskIDTask)
	q := `select id, data from tasks *`
	rs, err := dbconn.Query(q)

	for rs.Next() && err == nil {
		var tid TaskID
		var gob []byte

		e := rs.Scan(&tid, &gob)
		t, e := gob2task(gob, e)
		err = e

		t.ID = tid
		m[tid] = *t
	}
	if err != nil {
		report(err)
		return nil
	}
	return m
}

func (p *Player) GetDone(s StudentID) MapTheoryIDTaskCard {
	m := make(MapTheoryIDTaskCard)
	q := `select data, answer, correct, comment, appointments.theoryid 
		from appointments inner join tasks 
		on sid = $1 and taskid = tasks.id and complete = true`
	rs, err := dbconn.Query(q, s)

	for rs.Next() {
		var data []byte
		var answer []byte
		var correct bool
		var comment string
		var thid TheoryID

		e := rs.Scan(&data, &answer, &correct, &comment, &thid)
		task, e := gob2task(data, e)
		ans, e := gob2task(answer, e)
		err = e
		if err != nil {
			break
		}
		m[thid] = TaskCard{
			Task:    *task,
			Answer:  *ans,
			Correct: correct,
			Comment: comment,
		}
	}
	if err != nil {
		report(err)
		return nil
	}
	return m
}

func (p *Player) RenameStudent(id StudentID, new String) {
	q := `update logins set names = $2 where id = $1`
	_, err := dbconn.Exec(q, id, new)
	if err != nil {
		report(err)
	}
	return
}
