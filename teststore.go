package main

import (
	"bytes"
	"encoding/gob"
	"encoding/json"
	"os"
	"sync"

	"github.com/jackc/pgx"
)

// TaskLength is a maximum length of a gob containing a task in DB.
// We got this value empirically.
const TaskLength = 6 * 1 << 10

// TestStore is a storage of tests and assignments
type TestStore struct {
	sync.Mutex
	Given       map[StudentID][]TaskID
	GivenTheory map[StudentID][]TheoryID
	taskpath    string
	dumppath    string
	dirty       bool
	ConnPool    *pgx.ConnPool
}

// NewTestStore creates a new TestStore object
func NewTestStore(taskpath string, dumppath string, conn *pgx.ConnPool) *TestStore {
	return &TestStore{
		Given:    make(map[StudentID][]TaskID),
		taskpath: taskpath,
		dumppath: dumppath,
		dirty:    false,
		ConnPool: conn,
	}
}

// Dump dumps data to the aforementioned location
func (t *TestStore) Dump() error {
	t.Lock()
	defer t.Unlock()
	file, err := os.Open(t.dumppath)
	if err != nil {
		return err
	}
	e := json.NewEncoder(file)
	err = e.Encode(t)
	if err != nil {
		return err
	}
	return nil
}

// Load loads map data from known location
func (t *TestStore) Load() error {
	t.Lock()
	defer t.Unlock()
	file, err := os.Open(t.dumppath)
	if err != nil {
		return err
	}
	d := json.NewDecoder(file)
	err = d.Decode(t)
	if err != nil {
		return err
	}
	return nil
}

// Give sets given TestIDs for a user, previous TIDs are returned.
func (t *TestStore) Give(id StudentID, new []TaskID) (old []TaskID) {
	t.Lock()
	defer t.Unlock()
	old = t.Given[id]
	t.Given[id] = new
	return
}

// Manipulate is a swiss army knife for editing tests.
// It replaces already created test with new.
// If new is nil it only returns test value and current last tid.
// It is is possible to create a test with custom TestID with this method.
// func (t *TestStore) Manipulate(tid TestID, new []TaskID) (TestID, []TaskID) {
// 	t.Lock()
// 	defer t.Unlock()
// 	t.dirty = true
// 	old, _ := t.Tests[tid]
// 	if new != nil {
// 		t.Tests[tid] = new
// 	}
// 	return t.LatestTestID, old
// }

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

// ReadTask loads task by ID from file in location set on init
func (t *TestStore) ReadTask(tid TaskID) (*Task, error) {
	buf := make([]byte, 0, TaskLength)
	row := t.ConnPool.QueryRow("write", "select data from tasks where id = $1", tid)
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

// WriteTask writes task to the store
func (t *TestStore) WriteTask(tk *Task, tid TaskID) error {
	t.Lock()
	defer t.Unlock()
	var err error
	btk, err := task2gob(tk)
	if err != nil {
		return err
	}
	_, err = t.ConnPool.Exec("write", "insert into tasks (id, data) values ($1, $2)", tid, btk)
	if err != nil {
		return err
	}
	return nil
}
