package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
)

const (
	// TestStoreDumpPath is a path to cold storage
	TestStoreDumpPath string = "dump.json"
	// TaskJSONLoadPath is a path to individual task data
	TaskJSONLoadPath string = "tasks/"
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

// TestStore is a user storage of tests
type TestStore struct {
	sync.Mutex
	Assigns map[UserID][]TestID
	Tests   map[TestID][]TaskID
}

// NewTestStore creates a new TestStore object
func NewTestStore() *TestStore {
	return &TestStore{
		Assigns: make(map[UserID][]TestID),
		Tests:   make(map[TestID][]TaskID),
	}
}

// Dump dumps map data to known location
func (t *TestStore) Dump() error {
	t.Lock()
	defer t.Unlock()
	file, err := os.Open(TestStoreDumpPath)
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
	file, err := os.Open(TestStoreDumpPath)
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
	old = t.Assigns[id]
	t.Assigns[id] = new
	return
}

func (t *TestStore) Compose(tasks []TaskID) TestID {
	t.Lock()
	defer t.Unlock()

	
}

func (t *TestStore) Recompose(tid TestID, new []TaskID) []TaskID {

}

// Loads task by ID from file in location set by TaskJSONLoadPath
func taskjson(tid TaskID) []byte {
	f, err := os.Open(TaskJSONLoadPath + fmt.Sprint(tid))
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
