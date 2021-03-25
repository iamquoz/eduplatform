package main

import (
	"crypto/sha512"
	"log"
	"net/http"
	"reflect"
	"strconv"
	"time"

	"github.com/jackc/pgx"
)

var methods map[string]http.HandlerFunc

var ts TokenStore
var dbconn *pgx.ConnPool

func makeAuth(r *http.Request) (Player, int) {
	t, err := r.Cookie("token")
	if err != nil {
		return NilPlayer(), http.StatusBadRequest
	}
	k, err := strconv.ParseUint(t.Value, 16, 64)
	if err != nil {
		return NilPlayer(), http.StatusBadRequest
	}
	player := ts.GetAuth(k)
	if player == NilPlayer() {
		return NilPlayer(), http.StatusUnauthorized
	}
	return player, http.StatusOK
}

func init() {
	// init db connection
	var err error
	dbconn, err = pgx.NewConnPool(pgx.ConnPoolConfig{
		MaxConnections: 2500,
		ConnConfig: pgx.ConnConfig{
			Host: "localhost",
			Port: 5432,
		},
		AcquireTimeout: 120 * time.Second,
	})
	if err != nil {
		log.Fatal(err)
	}
	// initialize method names from type information
	n := reflect.TypeOf(Player{}).NumMethod()
	// wrap methods in their respective handler funcs
	for i := 0; i < n; i++ {
		m := reflect.TypeOf(Player{}).Method(n)
		methods[m.Name] = func(w http.ResponseWriter, r *http.Request) {
			// we'll definetly get a performance loss there but who cares?
			player, code := makeAuth(r)
			if code != http.StatusOK {
				w.WriteHeader(code)
				return
			}
			wval := reflect.ValueOf(w)
			rval := reflect.ValueOf(r)
			args := []reflect.Value{wval, rval}
			reflect.ValueOf(player).Method(i).Call(args)
			// it's sad that json.Unmarshall can't work on reflect.Value types
			// upd: it can, but this approach would be very dissatisfying to write and debug
		}
	}
}

func main() {
	var hasher = sha512.New()
	http.HandleFunc("/authorize", func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query()
		id, err := strconv.ParseUint(q.Get("id"), 10, 64)
		if err != nil {
			log.Print(err)
			return
		}
		// Andrew, you will send me hashes. No questions.
		passw := q.Get("passw")
		if passw == "" {
			log.Print(err)
			return
		}
		// Okay, send me fucking plaintext password...
		hashs := hasher.Sum([]byte(passw))
		hash := uint64(hashs[1]) |
			uint64(hashs[2])<<8 |
			uint64(hashs[3])<<16 |
			uint64(hashs[4])<<24
		// You'll regret this.
		uid := UserID(id)

		row := dbconn.QueryRow("select Passw, Role from UserIndex where ID = $1;", uid)
		var rpassw uint64
		var role int
		row.Scan(rpassw, role)

		if rpassw == hash {
			ts.MakeToken(uid, role)
		} else {
			w.WriteHeader(403)
			w.Write([]byte("Incorrect credentials"))
			return
		}
	})
	for k, v := range methods {
		http.HandleFunc(k, v)
	}
}
