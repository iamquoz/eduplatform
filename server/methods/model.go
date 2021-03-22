package methods

import "sync"

// UserID is used to discriminate users in database
type UserID uint

// StudentID is equivalent to UserID in context of student's methods
type StudentID UserID

// TeacherID is equivalent to UserID in context of teacher's methods
type TeacherID UserID

// AuthToken is an authorization discriminator value
type AuthToken uint

type ClassID uint

type CurriculumID uint

// AuthStore stores current users authorizations
// TODO maybe they're needed to be saved in some type of cold store? db?
type AuthStore struct {
	sync.Mutex
	Cookies map[AuthToken]UserID
}
