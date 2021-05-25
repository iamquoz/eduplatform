package main

import (
	"crypto/sha512"
	"encoding/json"
	"fmt"
	"io/ioutil"
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

func getsrvport() uint16 {
	s := os.Getenv("PORT")
	if s == "" {
		log.Println("$PORT isn't set, if it is under Heroku something bad happened.")
		return 8080
	}
	i, err := strconv.ParseUint(s, 10, 16)
	if err != nil {
		log.Fatal("$PORT contains no numbers.")
	}
	return uint16(i)
}

func getdbcred() pgx.ConnConfig {
	dburl := os.Getenv("DATABASE_URL")
	if dburl == "" {
		// testing locally
		return pgx.ConnConfig{
			Database: "postgres",
			Host:     "localhost",
			Port:     5432,
		}
	}
	conn, err := pgx.ParseURI(dburl)
	if err != nil {
		log.Fatal(err)
	}
	return conn
}

func init() {
	var err error
	// init db connection
	dbconn, err = pgx.NewConnPool(pgx.ConnPoolConfig{
		MaxConnections: 2500,
		ConnConfig:     getdbcred(),
		AcquireTimeout: 120 * time.Second,
	})
	if err != nil {
		log.Fatal(err)
	}
	rand.Seed(time.Now().Unix())
	ts = NewTokenStore()
	shutdown = make(chan struct{}, 0)
	// initialize method names from type information
	n := reflect.TypeOf(&Player{}).NumMethod()
	// wrap methods in their respective handler funcs
	methods = make(map[string]http.HandlerFunc)
	for ii := 0; ii < n; ii++ {
		i := ii
		m := reflect.TypeOf(&Player{}).Method(i)
		intyp := structsynth(m)
		// handler wrapper
		methods[m.Name] = func(w http.ResponseWriter, r *http.Request) {
			var err error
			// allow cors
			//w.Header().Add("Access-Control-Allow-Origin", "*")
			// we'll definetly get a performance loss there but who cares?
			player, code := makeAuth(r)
			if code != http.StatusOK {
				w.WriteHeader(code)
				w.Write([]byte(fmt.Sprintln(code)))
				return
			}
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
			out := reflect.ValueOf(player).Method(i).Call(in)

			os := shrinkstruct(out)
			err = je.Encode(os.Interface())
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(err.Error()))
				log.Println(err)
				return
			}
		}
	}
}

func console() {
	fmt.Println("Type `exit` to safely shut the server down.")
	for {
		fmt.Print(">> ")
		buf := make([]byte, 255)
		n, _ := os.Stdin.Read(buf)
		buf = buf[:n]
		switch string(buf) {
		case "auths\n":
			fmt.Print(ts)
		case "exit\n":
			shutdown <- struct{}{}
			runtime.Goexit()
		}
	}
}

func killhandle() {
	sig := make(chan os.Signal)
	signal.Notify(sig, os.Interrupt)
	select {
	case <-sig:
		shutdown <- struct{}{}
	case <-shutdown:
		// just exit
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
		uid := StudentID(id)

		row := dbconn.QueryRow("select hash, role from Logins where id = $1;", uid)
		var rpassw int32
		var role int
		err = row.Scan(&rpassw, &role)
		if err != nil {
			log.Print(err)
		}
		// unidiomatic, but i don't give a fuck
		fmt.Printf("uid %v has tried to authorize and ", uid)

		if rpassw == hash {
			tok := ts.MakeToken(uid, role)
			w.Write([]byte(strconv.FormatUint(tok, 16)))
			fmt.Println("succeeded")
		} else {
			w.WriteHeader(403)
			w.Write([]byte("Incorrect credentials"))
			fmt.Println("failed")
			return
		}
	})
	for k, v := range methods {
		http.HandleFunc("/api/"+k, v)
	}
	// handle frontend
	front, err := ioutil.ReadFile("./build/index.html")
	if err != nil {
		panic(err)
	}
	http.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		rw.Write(front)
	})
	go func() {
		// now here's the time for server's port number
		srvport := getsrvport()
		log.Println("server is on port", srvport)
		log.Fatal(http.ListenAndServe(":"+fmt.Sprint(srvport), nil))
	}()
	//go console()
	killhandle()
}
