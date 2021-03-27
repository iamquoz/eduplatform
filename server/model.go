package main

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

// NilPlayer returns a non-existing player.
// UserID 0 doesn't mean that player does not exist.
func NilPlayer() Player {
	return Player{UserID: 0, Role: -1}
}

// Last contains recently added ID values
var Last struct {
	sync.Mutex
	UserID
}

// TokenStore stores current users authorizations
// TODO maybe they're needed to be saved in some type of cold store? db?
type TokenStore struct {
	sync.Mutex
	Map map[uint64]Player
}

// NewTokenStore creates a new token storage
func NewTokenStore() *TokenStore {
	return &TokenStore{Mutex: sync.Mutex{}, Map: make(map[uint64]Player)}
}

// GetAuth is a concurrent-safe access to AuthStore
func (a *TokenStore) GetAuth(k uint64) (p Player) {
	a.Lock()
	defer a.Unlock()
	p, ok := a.Map[k]
	if !ok {
		return NilPlayer()
	}
	return
}

// RejectToken removes token from store and invalidates authentication
func (a *TokenStore) RejectToken(token uint64) {
	a.Lock()
	delete(a.Map, token)
	a.Unlock()
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
