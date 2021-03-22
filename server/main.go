package main

import (
	"log"
	"net/http"
	"sync"

	meth "github.com/iamquoz/matstat/server/methods"
)

// AuthStore stores current users authorizations
// TODO maybe they're needed to be saved in some type of cold store? db?
type AuthStore struct {
	sync.Mutex
	Cookies map[string]meth.UserID
}

func main() {

	log.Fatal(http.ListenAndServe(":8080", nil))
}
