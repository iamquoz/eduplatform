package methods

import (
	"math/rand"
	"sync"
)

// UserID is used to discriminate users in database
type UserID uint

// Roles of users
const (
	RoleTeacher = iota
	RoleStudent
	RoleHeadman
)

// Player is a user with its role
type Player struct {
	UserID
	Role int
}

// ClassID discriminates classes (groups) of students
type ClassID uint

// CurriculumID discriminates curriculums (courses) of groups
type CurriculumID uint

// Last contains recently added ID values
var Last struct {
	sync.Mutex
	UserID
	ClassID
	CurriculumID
}

// TokenStore stores current users authorizations
// TODO maybe they're needed to be saved in some type of cold store? db?
type TokenStore struct {
	sync.Mutex
	Map map[uint64]Player
}

// GetAuth is concurrent-safe access to AuthStore
func (a *TokenStore) GetAuth(k uint64) (u UserID, ok bool) {
	a.Lock()
	g, ok := a.Map[k]
	u = g.UserID
	a.Unlock()
	return
}

// MakeToken creates a token for a sucsessfully authorized user.
// Authorizations are checked somewhere else.
// It's possible to have multiple tokens for one user.
func (a *TokenStore) MakeToken(u UserID, role int) (token uint64) {
	a.Lock()
	defer a.Unlock()
again:
	token = rand.Uint64()
	_, k := a.Map[token]
	if k {
		goto again
	} else {
		a.Map[token] = Player{u, role}
	}

	return token
}
