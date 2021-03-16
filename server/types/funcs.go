package types

import (
	"bytes"
	"math/rand"
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

// MakeTeacher creates a new teacher
func MakeTeacher(name string) Teacher {
	// write to db
	return Teacher{
		id:   uint64(rand.Int63()),
		name: name,
	}
}

// MakeStudent creates a new student
func MakeStudent(name string) Student {
	// write to db
	return Student{
		id:       uint64(rand.Int63()),
		name:     name,
		Marks:    0,
		Complete: 0,
		Headman:  false,
	}
}

// MakeGroup creates new group, returns it descriptor and headman student
func MakeGroup(c Course, t Teacher, name string) (Group, Student) {

}
