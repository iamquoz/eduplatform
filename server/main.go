package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	meth "github.com/iamquoz/matstat/server/methods"
	"github.com/jackc/pgx"
)

var auths *meth.AuthStore
var dbconn *pgx.ConnPool

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

func tryAuthorize(id meth.UserID, passw uint64, db *pgx.ConnPool, a *meth.AuthStore) bool {
	row := db.QueryRow("select Passw from Users where ID = " + fmt.Sprint(id))
	var rpassw uint64
	row.Scan(rpassw)
	defer a.MakeAuth(id)
	return rpassw == passw
}

func main() {
	http.HandleFunc("/authorize", func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query()
		id, err := strconv.ParseUint(q.Get("id"), 10, 64)
		if err != nil {
			log.Print(err)
		}
		// Andrew, you will send me hashes. No questions.
		passw, err := strconv.ParseUint(q.Get("passw"), 10, 64)
		if err != nil {
			log.Print(err)
		}
		if tryAuthorize(meth.UserID(id), passw, dbconn, auths) {
			// make goroutine or something
		} else {
			// 403
		}
	})
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		s, err := r.Cookie("token")
		if err != nil {
			// TODO return 403
			return
		}
		tok, err := strconv.ParseUint(s.Value, 16, 64)
		if err != nil {
			// TODO return 403
			return
		}
		_, ok := auths.GetAuth(tok)
		if ok {
			// handle method
		} else {
			// 403
		}
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
