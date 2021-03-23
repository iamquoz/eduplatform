package methods

import (
	"math/rand"
	"sync"
)

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
	Map      map[uint64]UserID
	teachers map[UserID]struct{} // flex
	headmen  map[UserID]struct{}
}

// GetAuth is concurrent-safe access to AuthStore
func (a *AuthStore) GetAuth(k uint64) (u UserID, ok bool) {
	a.Lock()
	u, ok = a.Map[k]
	a.Unlock()
	return
}

// MakeAuth creates a token for sucsessfully authorized user.
// Authorizations are checked somewhere else.
func (a *AuthStore) MakeAuth(u UserID, role int) (token uint64) {
	a.Lock()
	defer a.Unlock()
again:
	token = rand.Uint64()
	_, k := a.Map[token]
	if k {
		goto again
	}
	switch role {
	case 0:
		// student
	case 1:
		a.IsHeadman(u, +1)
	case 2:
		a.IsTeacher(u, +1)
	}

	return token
}

// IsTeacher is simultaneously a statement and a predicate!!!
// Action < 0 is remove, action > 0 is add.
// This is fucking awful, I admit it.
func (a *AuthStore) IsTeacher(u UserID, action int) bool {
	a.Lock()
	defer a.Unlock()
	_, e := a.teachers[u]
	switch {
	case action < 0:
		delete(a.teachers, u)
	case action > 0:
		a.teachers[u] = struct{}{}
	}
	return e
}

// IsHeadman is a same miserable shit as the IsTeacher. See its description.
func (a *AuthStore) IsHeadman(u UserID, action int) bool {
	a.Lock()
	defer a.Unlock()
	_, e := a.headmen[u]
	switch {
	case action < 0:
		delete(a.headmen, u)
	case action > 0:
		a.headmen[u] = struct{}{}
	}
	return e
}
