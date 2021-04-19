package main

import "time"

// TaskID is a unique task identitier.
type TaskID int32

// Task is a task of test
type Task struct {
	ID         TaskID
	IsOpen     bool
	Difficulty uint
	Question   string
	Variants   []string
	Correct    string
}

// TheoryID is a unique theory data ID.
type TheoryID int32

// Theory is a theory data storing struct
type Theory struct {
	ID     TheoryID
	Header string
	Body   string
}

// Stats describes student's statistics in system.
// This structure with its asocciated methods are subjects to change
// in future versions.
type Stats struct {
	Total         []uint
	Correct       []uint
	TotalAttempts uint
}

// StudentID is used to discriminate users in database
type StudentID int32

// Wrapper types.
type (
	// String is a wrapper over regular string for use as an anonymous field from method argument
	// because `reflect` doesn't provide a way to get an argument of primitive or private type
	//
	// And also for sake of orthogonality, yyyeeeaaaaahhhh...
	String                  string
	TaskIDArray             []TaskID
	StudentIDArray          []StudentID
	MapStudentIDString      map[StudentID]string
	MapStudentIDTaskID      map[StudentID]TaskID
	MapStudentIDArrayTaskID map[StudentID][]TaskID
	Int                     int
)

// Player is a user with its role and token
type Player struct {
	StudentID
	Role   int
	Token  uint64
	Tested time.Duration
}

// NilPlayer returns a non-existing player.
// UserID 0 doesn't imply that player does not exist.
func NilPlayer() Player {
	return Player{StudentID: 0, Role: -1, Token: 0}
}
