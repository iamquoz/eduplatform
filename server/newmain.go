package main

import (
	"crypto/sha512"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"reflect"
	"runtime"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx"
)

var methods map[string]http.HandlerFunc

var ts *TokenStore
var tes *TestStore
var dbconn *pgx.ConnPool
var shutdown chan struct{}

const (
	dumppath string = "dump.json"
	taskpath string = "tasks/"
)

func makeAuth(r *http.Request) (*Player, int) {
	t, err := r.Cookie("token")
	if err != nil {
		return nil, http.StatusBadRequest
	}
	k, err := strconv.ParseUint(t.Value, 16, 64)
	if err != nil {
		return nil, http.StatusBadRequest
	}
	player := ts.GetAuth(k)
	if player == nil {
		return nil, http.StatusUnauthorized
	}
	return player, http.StatusOK
}

func structsynth(m reflect.Method) (in reflect.Type) {
	n := m.Type.NumIn()
	fields := make([]reflect.StructField, n-1)
	for i := 1; i < n; i++ {
		fields[i-1] = reflect.StructField{
			Type: m.Type.In(i),
			Name: m.Type.In(i).Name(),
		}
	}
	in = reflect.StructOf(fields)
	// json.Unmarshall will correctly generate all maps and slices
	// thanks to it for that
	return
}

func explodestruct(v reflect.Value) (args []reflect.Value) {
	n := v.NumField()
	args = make([]reflect.Value, n)
	for i := 0; i < n; i++ {
		args[i] = v.Field(i)
	}
	return args
}

func shrinkstruct(args []reflect.Value) reflect.Value {
	n := len(args)
	fields := make([]reflect.StructField, n)
	for i := 0; i < n; i++ {
		fields[i] = reflect.StructField{
			Type: args[i].Type(),
			Name: args[i].Type().Name(),
		}
	}
	v := reflect.New(reflect.StructOf(fields))
	for i := 0; i < n; i++ {
		v.Elem().Field(i).Set(args[i])
	}
	return v
}

func init() {
	var err error
	rand.Seed(time.Now().Unix())
	ts = NewTokenStore()
	tes = NewTestStore(taskpath, dumppath)
	shutdown = make(chan struct{}, 0)
	// init teststore
	err = tes.Load()
	switch err.(type) {
	case *os.PathError:
		// err here means that it was never dumped to this point, so ignore it
	default:
		log.Fatal(err)
	}
	// init db connection
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
		intyp := structsynth(m)
		log.Println(m.Name, ui)
		methods[m.Name] = func(w http.ResponseWriter, r *http.Request) {
			var err error
			// we'll definetly get a performance loss there but who cares?
			player, code := makeAuth(r)
			if code != http.StatusOK {
				w.WriteHeader(code)
				w.Write([]byte(fmt.Sprintln(code)))
				return
			}
			fmt.Println(m.Name, "by", player)
			// if method's name begins with the "St" -- it is a student's method
			// else only teacher can call it
			if player.Role > 0 && !strings.HasPrefix(m.Name, "St") {
				w.WriteHeader(http.StatusForbidden)
				w.Write([]byte("No"))
				return
			}

			jd := json.NewDecoder(r.Body)
			je := json.NewEncoder(w)

			is := reflect.New(intyp)
			err = jd.Decode(is.Interface())
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte(err.Error()))
				log.Println(err)
				return
			}
			in := explodestruct(is.Elem())
			println(ui)
			out := reflect.ValueOf(player).Method(ui).Call(in)
			os := shrinkstruct(out)
			err = je.Encode(os.Interface())
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(err.Error()))
				log.Println(err)
				return
			}
			// it's sad that json.Unmarshall can't work on reflect.Value types
			// upd: it can, but this approach would be very dissatisfying to write and debug
			// upd2: so i did it anyway. i bet i can't bring it to life
			// upd3: i did it.
		}
	}
	// check for dirtiness of teststore every minute, dump if necessary
	go func() {
		for {
			select {
			case <-shutdown:
				runtime.Goexit()
			case <-time.After(60 * time.Second):
			}
			if tes.dirty {
				log.Println("dumping the teststore")
				log.Println(tes.Dump())
				// this is the only place we change this value
				// locking isn't necessary, i guess
				tes.dirty = false
			}

		}
	}()
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
	go func() {
		log.Fatal(http.ListenAndServe(":8080", nil))
	}()
	// on exit
	sig := make(chan os.Signal)
	signal.Notify(sig, os.Interrupt)
	fmt.Println("Press ctrl+c to safely shut the server down.")
	<-sig
	shutdown <- struct{}{}
}
