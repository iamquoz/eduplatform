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

const MaxAttempts = 3
const DifficultyLevels = 3

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

// thanks @cristaloleg for showing this in your tg channel
func task2gob(tk *Task, err error) ([]byte, error) {
	if err != nil {
		return nil, err
	}
	buf := bytes.NewBuffer(make([]byte, 0, TaskLength))
	ge := gob.NewEncoder(buf)
	err = ge.Encode(tk)
	return buf.Bytes(), err
}

func gob2task(btk []byte, err error) (*Task, error) {
	if err != nil {
		return nil, err
	}
	gd := gob.NewDecoder(bytes.NewBuffer(btk))
	tk := new(Task)
	err = gd.Decode(tk)
	return tk, err
}

func theory2gob(th *Theory, err error) ([]byte, error) {
	if err != nil {
		return nil, err
	}
	buf := bytes.NewBuffer(make([]byte, 0, TaskLength))
	ge := gob.NewEncoder(buf)
	err = ge.Encode(th)
	return buf.Bytes(), err
}

func gob2theory(btk []byte, err error) (*Theory, error) {
	if err != nil {
		return nil, err
	}
	gd := gob.NewDecoder(bytes.NewBuffer(btk))
	th := new(Theory)
	err = gd.Decode(th)
	return th, err
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
	tk, err := gob2task(buf, err)
	if err != nil {
		return nil, err
	}
	return tk, nil
}
