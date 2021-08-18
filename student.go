package main

import (
	"fmt"
)

// StLogout is a deauth method
func (p *Player) StLogout() {
	ts.RejectToken(p.Token)
}

// StGetTask returns a task by id. Any user can get any task, this is
// not intentional. Probably needs to be fixed.
func (p *Player) StGetTask(id TaskID) Task {
	v, err := readtask(id)
	if err != nil {
		fmt.Println(err)
		return Task{ID: -1}
	}
	v.Correct = ""
	return *v
}

// StRegister changes password for a user
func (p *Player) StRegister(new String) {
	query := `update logins set hash = $1 where id = $2`
	h := sesh(string(new))
	_, err := dbconn.Exec(query, h[:], p.StudentID)
	if err != nil {
		report(err)
	}
}

// StGetTheory loads theory data by ID
func (p *Player) StGetTheory(tid TheoryID) Theory {
	buf := make([]byte, 0, TaskLength)
	row := dbconn.QueryRow(`select data from theory where id = $1`, tid)
	err := row.Scan(&buf)
	th, err := gob2theory(buf, err)
	if err != nil {
		report(err)
		return Theory{ID: -1}
	}
	th.ID = tid
	return *th
}

// StSelfStats returns stats for the student himself
func (p *Player) StSelfStats() MapTheoryIDStats {
	return p.GetStats(p.StudentID)
}

func (p *Player) StRating() MapTaskIDInt {
	query := `select taskid, correct from appointments where sid = $1`
	m := make(MapTaskIDInt)
	rows, err := dbconn.Query(query, p.StudentID)
	if err != nil {
		report(err)
		return nil
	}
	for rows.Next() {
		var taskid TaskID
		var correct bool
		rows.Scan(&taskid, &correct)
		// maybe todo
		if correct {
			m[taskid] = 1
		} else {
			m[taskid] = 0
		}
	}
	return m
}

func (p *Player) StRename(new String) {
	p.RenameStudent(p.StudentID, new)
	return
}

type sentstruct struct {
	TaskID
	Tries int
}
type MapTheoryIDSentstructArray map[TheoryID][]sentstruct

func (p *Player) StSent() MapTheoryIDSentstructArray {
	query := `select taskid, theoryid, tries from appointments where sid = $1 and complete = false`
	rows, err := dbconn.Query(query, p.StudentID)
	a := make(MapTheoryIDSentstructArray, 10)
	for rows.Next() && err == nil {
		var taskid TaskID
		var theoryid TheoryID
		var tries int
		rows.Scan(&taskid, &theoryid, &tries)
		a[theoryid] = append(a[theoryid], sentstruct{taskid, tries})
	}
	if err != nil {
		report(err)
		return nil
	}
	return a
}

// StSendAnswers is used by a student to send their answers back.
// Returns a count of remaining attempts for the task student sent, -1 on error and
// -2 if sent task was answered correctrly.
func (p *Player) StSendAnswers(tid TaskID, ans Task) Int {
	q := `select tries, data, complete from appointments inner join tasks on taskid = id and taskid = $1 and sid = $2`
	row := dbconn.QueryRow(q, tid, p.StudentID)
	var n int32
	var origtask []byte
	var compl bool
	err := row.Scan(&n, &origtask, &compl)
	if err != nil {
		report(err)
		return -1
	}
	if n >= MaxAttempts || compl {
		// shitcode
		q = `update appointments 
			set complete = true
			where sid = $1 and taskid = $2 and tries = $3`
		_, err = dbconn.Exec(q, p.StudentID, tid, n+1)
		if err != nil {
			report(err)
		}
		return 0
	}
	tk, err := task2gob(&ans, nil)
	orig, err := gob2task(origtask, err)
	if err != nil {
		report(err)
		return -1
	}
	if orig.IsOpen {
		n = MaxAttempts // open questions have only one attempt
		q := `update appointments 
			set answer = $1, tries = $4, comment = null, complete = true	
			where sid = $2 and taskid = $3`
		_, err = dbconn.Exec(q, tk, p.StudentID, tid, n+1)
		return -2
	}
	if orig.Correct == ans.Correct {
		q := `update appointments 
			set answer = $1, tries = $4, correct = true, complete = true
			where sid = $2 and taskid = $3`
		_, err = dbconn.Exec(q, tk, p.StudentID, tid, n+1)
		return -2
	}
	q = `update appointments 
		set answer = $1, tries = $4, correct = false, complete = false
		where sid = $2 and taskid = $3`
	_, err = dbconn.Exec(q, tk, p.StudentID, tid, n+1)
	if err != nil {
		report(err)
		return -1
	}
	return Int(MaxAttempts - n)

}

func (p *Player) StCommentary(tid TaskID) String {
	query := `select comment from appointments where taskid = $1`
	row := dbconn.QueryRow(query, tid)
	var comm String
	err := row.Scan(&comm)
	if err != nil {
		report(err)
		return ""
	}
	return comm
}

func (p *Player) StDigest() MapTheoryIDTheory {
	m := make(MapTheoryIDTheory)
	q := `select id, data from theory *`
	rs, err := dbconn.Query(q)
	var thid TheoryID
	var gob []byte
	for rs.Next() && err == nil {
		e := rs.Scan(&thid, &gob)
		th, e := gob2theory(gob, e)
		err = e
		th.ID = thid
		m[thid] = *th
	}
	if err != nil {
		report(err)
		return nil
	}
	return m
}

func (p *Player) StDone() MapTheoryIDTaskCard {
	return p.GetDone(p.StudentID)
}

func (p *Player) StGetAnswers(tid TaskID) Task {
	q := `select data, tries from appointments inner join tasks on taskid = id and taskid = $1 and sid = $2`
	rs := dbconn.QueryRow(q, tid, p.StudentID)
	var tk []byte
	var trs int
	err := rs.Scan(&tk, trs)
	if err != nil {
		report(err)
		return Task{ID: -1}
	}
	if trs < MaxAttempts {
		return Task{ID: -2}
	}
	task, err := gob2task(tk, nil)
	task.ID = tid
	return *task
}
