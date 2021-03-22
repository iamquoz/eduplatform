package methods

import "sync"

// UserID is used to discriminate users in database
type UserID uint

// StudentID is equivalent to UserID in context of student's methods
type StudentID UserID

// TeacherID is equivalent to UserID in context of teacher's methods
type TeacherID UserID

// ClassID discriminates classes (groups) of students
type ClassID uint

// CurriculumID discriminates curriculums (courses) of groups
type CurriculumID uint

// Last contains recently added ID values
var Last struct {
	sync.Mutex
	UserID
	StudentID
	TeacherID
	ClassID
	CurriculumID
}

// AuthStore stores current users authorizations
// TODO maybe they're needed to be saved in some type of cold store? db?
type AuthStore struct {
	sync.Mutex
	Map map[uint64]UserID
}

// Get is concurrent-safe access to AuthStore
func (a *AuthStore) Get(k uint64) (u UserID, ok bool) {
	a.Lock()
	u, ok = a.Map[k]
	a.Unlock()
	return
}
