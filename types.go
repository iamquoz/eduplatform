package main

import "time"

// TaskID is used as an identitier in DB
type TaskID int32

// Task is a task of test
type Task struct {
	IsOpen     bool
	Difficulty uint
	Question   string
	Variants   []string
	Correct    string
}

type TheoryID int32

// Test is a collection of tasks
type Test []Task

// TestID is an identifier of a test. Teacher can give it to the student.
type TestID int32

// UserID is used to discriminate users in database
type UserID int32

type (
	// String is a wrapper over regular string for use as an anonymous field from method argument
	// because `reflect` doesn't provide a way to get method names
	//
	// And also for sake of orthogonality, yuh...
	String               string
	TaskIDArray          []TaskID
	TestIDArray          []TestID
	MapUserIDString      map[UserID]string
	MapTestIDTaskIDArray map[TestID][]TaskID
	Int                  int
)

// Player is a user with its role
type Player struct {
	UserID
	Role   int
	Token  uint64
	Tested time.Duration
}

// NilPlayer returns a non-existing player.
// UserID 0 doesn't mean that player does not exist.
func NilPlayer() Player {
	return Player{UserID: 0, Role: -1, Token: 0}
}
