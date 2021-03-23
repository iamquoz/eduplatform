package main

import (
	"crypto/sha512"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"time"

	meth "github.com/iamquoz/matstat/server/methods"
	"github.com/jackc/pgx"
)

var auths *meth.AuthStore
var dbconn *pgx.ConnPool

/*
func initTeachers(db *pgx.ConnPool) (t []meth.TeacherID) {
	t = make([]meth.TeacherID, 0, 50)
	rows, err := db.Query("select ID from Users where Role = 0")
	if err != nil {
		log.Fatal(err)
	}
	for rows.Next() {
		var id meth.TeacherID
		err := rows.Scan(id)
		if err != nil {
			log.Print(err)
		}
		t = append(t, id)
	}
	return t
}

func initHeadmen(db *pgx.ConnPool) (h []meth.StudentID) {
	h = make([]meth.StudentID, 0, 50)
	rows, err := db.Query("select ID from Users where Role = 2")
	if err != nil {
		log.Fatal(err)
	}
	for rows.Next() {
		var id meth.StudentID
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

// no need in being concurrent -- accessed only there
var send map[meth.UserID]chan url.Values
var recv map[meth.UserID]chan []byte

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
		uid := meth.UserID(id)

		row := dbconn.QueryRow("select Passw, Role from UserIndex where ID = $1;", uid)
		var rpassw uint64
		var role int
		row.Scan(rpassw, role)

		if rpassw == hash {
			auths.MakeAuth(uid, role)

			send[uid] = make(chan url.Values, 0)
			recv[uid] = make(chan []byte, 0)

			/*if auths.IsTeacher(uid, 0) {
				go handleTeacher(send[uid], recv[uid])
			} else {
				go handleStudent(send[uid], recv[uid])
			}
			*/
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
			send[uid] <- r.URL.Query()
			// DUH that's alternative to a mutex, because they're going to
			// be running simultaneously
			w.Write(<-recv[uid])
		} else {
			goto fail
		}
		return
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
