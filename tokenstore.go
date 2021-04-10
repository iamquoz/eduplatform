package main

import (
	"fmt"
	"math/rand"
	"sync"
)

// TokenStore stores current users authorizations
// TODO maybe they're needed to be saved in some type of cold store? db?
type TokenStore struct {
	sync.Mutex
	Map map[uint64]*Player
}

func (a *TokenStore) String() string {
	var s string
	for k, v := range a.Map {
		s += fmt.Sprintf("%x is id %v of %v\n", k, v.UserID, v.Role)
	}
	return s
}

// NewTokenStore creates a new token storage
func NewTokenStore() *TokenStore {
	return &TokenStore{Mutex: sync.Mutex{}, Map: make(map[uint64]*Player)}
}

// GetAuth is a concurrent-safe access to AuthStore
func (a *TokenStore) GetAuth(k uint64) (p *Player) {
	a.Lock()
	defer a.Unlock()
	p, ok := a.Map[k]
	if !ok {
		return nil
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
		a.Map[token] = &Player{u, role, token, 0}
	}

	return token
}
