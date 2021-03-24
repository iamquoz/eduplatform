package main

import (
	"crypto/sha512"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/jackc/pgx"
)

var auths *TokenStore
var dbconn *pgx.ConnPool

/*
func initTeachers(db *pgx.ConnPool) (t []TeacherID) {
	t = make([]TeacherID, 0, 50)
	rows, err := db.Query("select ID from Users where Role = 0")
	if err != nil {
		log.Fatal(err)
	}
	for rows.Next() {
		var id TeacherID
		err := rows.Scan(id)
		if err != nil {
			log.Print(err)
		}
		t = append(t, id)
	}
	return t
}

func initHeadmen(db *pgx.ConnPool) (h []StudentID) {
	h = make([]StudentID, 0, 50)
	rows, err := db.Query("select ID from Users where Role = 2")
	if err != nil {
		log.Fatal(err)
	}
	for rows.Next() {
		var id StudentID
		err := rows.Scan(id)
		if err != nil {
			log.Print(err)
		}
		h = append(h, id)
	}
	return h
}
*/

func init() {
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

}

func handleUser(uid UserID, val url.Values, w http.ResponseWriter) {

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
			auths.MakeToken(uid, role)
		} else {
			w.WriteHeader(403)
			w.Write([]byte("Incorrect credentials"))
			return
		}
	})
	http.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
		goto skip
	fail:
		w.WriteHeader(401)
		w.Write([]byte("{}"))
		return
	skip:
		s, err := r.Cookie("token")
		if err != nil {
			goto fail
		}
		tok, err := strconv.ParseUint(s.Value, 16, 64)
		if err != nil {
			goto fail
		}
		uid, ok := auths.GetAuth(tok)
		if ok {
			handleUser(uid, r.URL.Query(), w)
		} else {
			goto fail
		}
		return
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
