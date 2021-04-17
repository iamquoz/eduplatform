package main

import (
	"encoding/gob"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
)

// TestStore is a storage of tests and assignments
type TestStore struct {
	sync.Mutex
	Given        map[UserID][]TestID
	GivenTheory  map[UserID][]TheoryID
	Tests        map[TestID][]TaskID
	LatestTestID TestID
	taskpath     string
	dumppath     string
	dirty        bool
}

// NewTestStore creates a new TestStore object
func NewTestStore(taskpath string, dumppath string) *TestStore {
	return &TestStore{
		Given:        make(map[UserID][]TestID),
		Tests:        make(map[TestID][]TaskID),
		LatestTestID: 0,
		taskpath:     taskpath,
		dumppath:     dumppath,
		dirty:        false,
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
func (t *TestStore) Give(id UserID, new []TestID) (old []TestID) {
	t.Lock()
	defer t.Unlock()
	old = t.Given[id]
	t.Given[id] = new
	return
}

// Compose adds test to the store
func (t *TestStore) Compose(tasks []TaskID) TestID {
	t.Lock()
	defer t.Unlock()
	t.dirty = true
	tid := t.LatestTestID
	t.LatestTestID++
	t.Tests[tid] = tasks
	return tid
}

// Manipulate is a swiss army knife for editing tests.
// It replaces already created test with new.
// If new is nil it only returns test value and current last tid.
// It is is possible to create a test with custom TestID with this method.
func (t *TestStore) Manipulate(tid TestID, new []TaskID) (TestID, []TaskID) {
	t.Lock()
	defer t.Unlock()
	t.dirty = true
	old, _ := t.Tests[tid]
	if new != nil {
		t.Tests[tid] = new
	}
	return t.LatestTestID, old
}

// ReadTask loads task by ID from file in location set on init
func (t *TestStore) ReadTask(tid TaskID) *Task {
	tk := new(Task)
	f, err := os.Open(t.taskpath + fmt.Sprint(tid))
	if err != nil {
		log.Print(err)
		return nil
	}
	gd := gob.NewDecoder(f)
	err = gd.Decode(tk)
	if err != nil {
		log.Print(err)
		return nil
	}
	return tk
}

// fs access mutex
var fsmu sync.Mutex

// WriteTask writes task to file on location
func (t *TestStore) WriteTask(tk *Task, tid TaskID) bool {
	fsmu.Lock() // don't block map on fs access
	defer fsmu.Unlock()
	f, err := os.Create(t.taskpath + fmt.Sprint(tid))
	if err != nil {
		log.Print(err)
		return false
	}
	ge := gob.NewEncoder(f)
	err = ge.Encode(tk)
	if err != nil {
		log.Print(err)
		return false
	}
	return true
}
