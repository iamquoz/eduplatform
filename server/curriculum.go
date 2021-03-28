package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
)

// Test is a collection of tasks
type Test []Task

// TestID is an identifier of a test. Teacher can give it to the student.
type TestID int32

// Task is a test task
type Task struct {
	IsOpen     bool     `json:"isOpen"`
	Difficulty uint     `json:"difficulty"`
	Question   string   `json:"text"`
	Variants   []string `json:"variants"`
	Correct    string   `json:"answer"`
}

// TaskID is used as an identitier in DB
type TaskID int32

// TestStore is a storage of tests and assignments
type TestStore struct {
	sync.Mutex
	Given        map[UserID][]TestID
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
func (t *TestStore) ReadTask(tid TaskID) []byte {
	f, err := os.Open(t.taskpath + fmt.Sprint(tid))
	if err != nil {
		log.Print(err)
		return nil
	}
	fs, _ := f.Stat()
	buf := make([]byte, fs.Size())
	_, err = f.Read(buf)
	if err != nil {
		log.Print(err)
		return nil
	}
	return buf
}

// WriteTask writes task to file on location
func (t *TestStore) WriteTask(data []byte, tid TaskID) bool {
	t.Lock()
	defer t.Unlock()
	f, err := os.Create(t.taskpath + fmt.Sprint(tid))
	if err != nil {
		log.Print(err)
		return false
	}
	_, err = f.Write(data)
	if err != nil {
		log.Print(err)
		return false
	}
	return true
}
