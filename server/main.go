package main

import (
	"log"
	"net/http"
	"strconv"
	"time"

	meth "github.com/iamquoz/matstat/server/methods"
	"github.com/jackc/pgx"
)

var auths *meth.AuthStore
var dbconn *pgx.ConnPool
var teachers []meth.TeacherID
var headmans []meth.StudentID

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
	teachers = initTeachers(dbconn)

}

func main() {
	http.HandleFunc("/authorize", func(w http.ResponseWriter, r *http.Request) {

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
		v, ok := auths.Get(tok)
		if ok {

		}
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
