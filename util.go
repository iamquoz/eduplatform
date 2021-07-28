package main

import (
	"bytes"
	"crypto/sha512"
	"encoding/gob"
)

// TaskLength is a maximum length of a gob containing a task in DB.
// We got this value empirically. Untested though.
const TaskLength = 6 * 1 << 10

const MaxAttempts = 2

// get maximum id in table `tab`
func maxid(tab string) (u int, err error) {
	row := dbconn.QueryRow(`select max(id) from ` + tab)
	err = row.Scan(&u)
	if err != nil {
		return 0, err
	}
	return
}

// gets a hash of a password string
func sesh(passw string) []byte {
	var hasher = sha512.New()
	return hasher.Sum([]byte(passw))
}

func hcomp(a []byte, b []byte) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func task2gob(tk *Task) ([]byte, error) {
	buf := bytes.NewBuffer(make([]byte, 0, TaskLength))
	ge := gob.NewEncoder(buf)
	err := ge.Encode(tk)
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func gob2task(btk []byte) (tk *Task, err error) {
	gd := gob.NewDecoder(bytes.NewBuffer(btk))
	tk = new(Task)
	err = gd.Decode(tk)
	return
}

func theory2gob(th *Theory) ([]byte, error) {
	buf := bytes.NewBuffer(make([]byte, 0, TaskLength))
	ge := gob.NewEncoder(buf)
	err := ge.Encode(th)
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func gob2theory(btk []byte) (th *Theory, err error) {
	gd := gob.NewDecoder(bytes.NewBuffer(btk))
	th = new(Theory)
	err = gd.Decode(th)
	return
}

// this function tries to fix incorrect data sent by client
func taskfilter(tk *Task) *Task {
	if tk.Difficulty > 3 {
		tk.Difficulty = 3
	}
	if tk.Difficulty < 1 {
		tk.Difficulty = 1
	}
	return tk
}

// readtask loads task by ID from file in location set on init
func readtask(tid TaskID) (*Task, error) {
	buf := make([]byte, 0, TaskLength)
	row := dbconn.QueryRow("select data from tasks where id = $1", tid)
	err := row.Scan(buf)
	if err != nil {
		return nil, err
	}
	tk, err := gob2task(buf)
	if err != nil {
		return nil, err
	}
	return tk, nil
}

// writetask writes task to the store
func writetask(tk *Task, tid TaskID, thid TheoryID) error {
	var err error
	// FIXME
	query := `
	case when select id from tasks is not null then
		insert into tasks (id, data, theoryid) values ($1, $2, $3)
	else
		update values set data = $3 where id = $1
		update values set theoryid = $3 where id = $1
	end`
	tk = taskfilter(tk)
	btk, err := task2gob(tk)
	if err != nil {
		return err
	}
	_, err = dbconn.Exec(query, tid, btk, thid)
	if err != nil {
		return err
	}
	return nil
}
