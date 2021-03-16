package types

import (
	"bytes"
	"strings"
)

// Short shortens user name for displaying it somewhere with reduced screen real estate
func Short(s string) string {
	e := strings.Fields(s)
	if e == nil {
		return "Andrew, you fucked up your string filtering: name " + s + " can't be shortened!"
	}

	// maybe someone has a name with more than three words in it...
	h := e[0] + " " + string(bytes.Runes([]byte(e[1]))[1]) + ". "
	if len(e) >= 3 {
		for i := 3; i < len(e); i++ {
			h += string(bytes.Runes([]byte(e[i]))[1]) + ". "
		}
	}
	return h
}

// User describes an authenticated user of a system
type User interface {
	ID() uint64
	Name() string
}

// Student describes authenticated student
type Student struct {
	id       uint64
	name     string
	Marks    uint
	Complete uint
}

// Headman is a student that can edit group lists
type Headman struct {
	Student
}

// Teacher is a user that can rule them all
type Teacher struct {
	id   uint64
	name string
}

func (s Student) ID() uint64 { return s.id }

func (s Student) Name() string { return s.name }
