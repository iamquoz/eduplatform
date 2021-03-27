package main

import (
	"crypto/sha512"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx"
)

var methods map[string]http.HandlerFunc

var ts *TokenStore
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
	rand.Seed(time.Now().Unix())
	ts = NewTokenStore()
	// init db connection
	var err error
	dbconn, err = pgx.NewConnPool(pgx.ConnPoolConfig{
		MaxConnections: 2500,
		ConnConfig: pgx.ConnConfig{
			Database: "postgres",
			Host:     "localhost",
			Port:     5432,
		},
		AcquireTimeout: 120 * time.Second,
	})
	if err != nil {
		log.Fatal(err)
	}
	// initialize method names from type information
	n := reflect.TypeOf(&Player{}).NumMethod()
	// wrap methods in their respective handler funcs
	methods = make(map[string]http.HandlerFunc)
	for i := 0; i < n; i++ {
		// thank you, fucking closures
		ui := i
		m := reflect.TypeOf(&Player{}).Method(ui)
		println(m.Name, ui)
		methods[m.Name] = func(w http.ResponseWriter, r *http.Request) {
			// we'll definetly get a performance loss there but who cares?
			player, code := makeAuth(r)
			if code != http.StatusOK {
				w.WriteHeader(code)
				return
			}
			// if method's name begins with the "St" -- it is a student's method
			// else only teacher can call it
			if player.Role > 0 && !strings.HasPrefix(m.Name, "St") {
				w.WriteHeader(http.StatusForbidden)
				w.Write([]byte("No"))
				return
			}
			wval := reflect.ValueOf(w)
			rval := reflect.ValueOf(r)
			args := []reflect.Value{wval, rval}
			reflect.ValueOf(&player).Method(ui).Call(args)
			// it's sad that json.Unmarshall can't work on reflect.Value types
			// upd: it can, but this approach would be very dissatisfying to write and debug
		}
	}
}

func main() {
	var hasher = sha512.New()
	http.HandleFunc("/Authorize", func(w http.ResponseWriter, r *http.Request) {
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
		hash := int32(hashs[1]) |
			int32(hashs[2])<<8 |
			int32(hashs[3])<<16 |
			int32(hashs[4])<<24
		// You'll regret this.
		uid := UserID(id)

		row := dbconn.QueryRow("select hash, role from Logins where id = $1;", uid)
		var rpassw int32
		var role int
		err = row.Scan(&rpassw, &role)
		if err != nil {
			log.Print(err)
		}
		fmt.Println(uid, rpassw, hash, role)

		if rpassw == hash {
			tok := ts.MakeToken(uid, role)
			w.Write([]byte(strconv.FormatUint(tok, 16)))
		} else {
			w.WriteHeader(403)
			w.Write([]byte("Incorrect credentials"))
			return
		}
	})
	for k, v := range methods {
		http.HandleFunc("/"+k, v)
	}
	log.Fatal(http.ListenAndServe(":8080", nil))
}
