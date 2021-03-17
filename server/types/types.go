package types

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

// Teacher is a user that can rule them all
type Teacher struct {
	id   uint64
	name string
}

type Task struct {
}

type Course struct {
	Teacher    *Teacher
	Cirruculum []Task
}

type Group struct {
	Course   *Course
	Headman  *Student
	Students []Student // +headman
}
