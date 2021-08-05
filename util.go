package main

import (
	"bytes"
	"crypto/sha512"
	"encoding/gob"
	"log"
	"runtime"
)

// TaskLength is a maximum length of a gob containing a task in DB.
// We got this value empirically. Untested though.
const TaskLength = 6 * 1 << 10

const MaxAttempts = 2

func report(v ...interface{}) {
	var tracebuf = make([]byte, 20000)
	log.Println(v...)
	n := runtime.Stack(tracebuf, false)
	tracebuf = tracebuf[:n]
	log.Printf("%s", tracebuf)
}

// gets a hash of a password string
func sesh(passw string) [64]byte {
	return sha512.Sum512([]byte(passw))
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
	err := row.Scan(&buf)
	if err != nil {
		return nil, err
	}
	tk, err := gob2task(buf)
	if err != nil {
		return nil, err
	}
	return tk, nil
}
