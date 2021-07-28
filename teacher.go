package main

import (
	"fmt"
)

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
	row := dbconn.QueryRow(query, sesh(""), name)
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
	query := `select (id, names) from logins`
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
	id, err := writetask(&tk, nil, thid)
	if err != nil {
		report(err)
	}
	return id
}

// RenewTask updates task data saved under ID. Returns -1 on error.
func (p *Player) RenewTask(taid TaskID, tk Task, thid TheoryID) TaskID {
	taid, err := writetask(&tk, &taid, thid)
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
	bts, err := theory2gob(&th)
	query := `insert into theory (data) values ($1) returning id`
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
	bts, err := theory2gob(&th)
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
func (p *Player) Appoint(sida StudentIDArray, tida TaskIDArray) {
	query := `insert into appointments (sid, taskids, complete) values ($1, $2, $3)`
	for _, sid := range sida {
		_, err := dbconn.Exec(query, sid, tida, false)
		if err != nil {
			report(err)
			return
		}
	}
}

// GetStats returns stats for a student
func (p *Player) GetStats(StudentID) MapTheoryIDStats {
	//appointments (sid integer, taskid integer, complete boolean,
	//	correct boolean, tries integer, answer bytea, comment varchar)
	query := `select (taskid, correct, tries) from appointments where sid = $1 and complete = true`
	rows, err := dbconn.Query(query)
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
				if err != nil {
					fmt.Println(err)
					return nil
				}
				tk, err := gob2task(buf)
				if err != nil {
					fmt.Println(err)
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
	if err != nil {
		report(err)
		return nil
	}
	m := make(MapStudentIDArrayTaskID)
	for rows.Next() {
		var sid StudentID
		var taskid TaskID
		rows.Scan(&sid, &taskid)
		if _, k := m[sid]; k {
			m[sid] = append(m[sid], taskid)
		} else {
			// maybe in serious applications this 10 could be coefficient
			// multiplied to total students count
			m[sid] = make([]TaskID, 0, 10)
		}
	}
	return m
}

func (p *Player) LoadAnswer(StudentID, TaskID) *Task {
	query := `select data from appointments where sid = $1 and taskid = $2`
	row := dbconn.QueryRow(query)
	buf := make([]byte, 0, 255)
	err := row.Scan(buf)
	if err != nil {
		report(err)
		return nil
	}
	tk, err := gob2task(buf)
	if err != nil {
		report(err)
		return nil
	}
	return tk
}

func (p *Player) TheoryNames() MapTheoryIDString {
	query := `select (id, data) from theory`
	rows, err := dbconn.Query(query)
	if err != nil {
		report(err)
		return nil
	}
	m := make(MapTheoryIDString)
	for rows.Next() {
		var data []byte
		var id int32
		rows.Scan(&id, data)
		th, err := gob2theory(data)
		if err != nil {
			report(err)
			return nil
		}
		m[th.ID] = String(th.Header)
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
