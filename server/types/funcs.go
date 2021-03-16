package types

import (
	"bytes"
	"strings"
	"sync"
)

var mux sync.Mutex

// this 🤡 is 🤡 my 🤡 db 🤡
var studentsPOGGERS []Student = make([]Student, 0, 30)
var teachersPOGGERS []Teacher = make([]Teacher, 0, 2)

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
func MakeTeacher(name string) *Teacher {
	mux.Lock()
	i := uint64(len(teachersPOGGERS))
	teachersPOGGERS = append(teachersPOGGERS, Teacher{
		id:   i,
		name: name,
	})
	mux.Unlock()
	return &teachersPOGGERS[i]
}

// MakeStudent creates a new student
func MakeStudent(name string) *Student {
	mux.Lock()
	i := uint64(len(studentsPOGGERS))
	studentsPOGGERS = append(studentsPOGGERS, Student{
		id:       i,
		name:     name,
		Marks:    0,
		Complete: 0,
	})
	mux.Unlock()
	return &studentsPOGGERS[i]
}

// MakeGroup creates new group, returns it descriptor and headman student.
// Why? Because i think first group will be created even before first student is registered.
// Let's think about existing students addition functionality later.
func MakeGroup(c Course, t Teacher, name string) (*Group, *Student) {
	// db work

}
