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
func (p *Player) StGetTask(id TaskID) *Task {
	v, err := readtask(id)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	v.Correct = ""
	return v
}

// StRegister changes password for a user
func (p *Player) StRegister(new String) {
	query := `update logins set hash = $1 where id = $2`
	_, err := dbconn.Exec(query, sesh(string(new)), p.StudentID)
	if err != nil {
		report(err)
	}
}

// StGetTheory loads theory data by ID
func (p *Player) StGetTheory(tid TheoryID) *Theory {
	row := dbconn.QueryRow(`select from theory where id = $1`, tid)
	theory := new(Theory)
	err := row.Scan(theory)
	if err != nil {
		report(err)
		return nil
	}
	theory.ID = tid
	return theory
}

// StSelfStats returns stats for the student himself
func (p *Player) StSelfStats() MapTheoryIDStats {
	return p.GetStats(p.StudentID)
}

func (p *Player) StRating() MapTaskIDInt {
	query := `select from appointments (taskid, correct) where sid = $1`
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

func (p *Player) StSent() TaskIDArray {
	query := `select from appointments taskid where sid = $1`
	rows, err := dbconn.Query(query, p.StudentID)
	a := make(TaskIDArray, 0, 10)
	if err != nil {
		report(err)
		return nil
	}
	for rows.Next() {
		var taskid TaskID
		rows.Scan(&taskid)
		a = append(a, taskid)
	}
	return a
}

func (p *Player) StSendAnswers(tid TaskID, task Task) Int {
	sel := `select tries from appointments where taskid = $1 and sid = $2`
	row := dbconn.QueryRow(sel, tid, p.StudentID)
	var n int32
	err := row.Scan(&n)
	if err != nil {
		report(err)
		return -1
	}
	// student haven't sent answers yet
	if n < MaxAttempts {
		query := `update appointments 
			set answer = $1
			where sid = $2 and taskid = $3`
		tk, err := task2gob(&task)
		if err != nil {
			report(err)
			return -1
		}
		_, err = dbconn.Exec(query, tk, p.StudentID, tid)
		if err != nil {
			report(err)
			return -1
		}
		return Int(MaxAttempts - n)
	}
	return 0
}

func (p *Player) StCommentary(tid TaskID) String {
	query := `select from appointments comment where taskid = $1`
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
	err := func(err error) bool {
		if err != nil {
			report(err)
			return true
		}
		return false
	}
	m := make(MapTheoryIDTheory)
	q := `select id, data from theory *`
	rs, e := dbconn.Query(q)
	if err(e) {
		return nil
	}
	var thid TheoryID
	var gob []byte
	for rs.Next() {
		e = rs.Scan(&thid, &gob)
		if err(e) {
			return nil
		}
		th, e := gob2theory(gob)
		if err(e) {
			return nil
		}
		m[thid] = *th
	}
	return m
}
