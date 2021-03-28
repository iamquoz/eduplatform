package main

import (
	"crypto/sha512"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

// Flop is a test method, it returns a string to check that server is working correctly
func (p *Player) Flop(w http.ResponseWriter, r *http.Request) {
	_, err := w.Write([]byte("i'am wanted for war crimes in uganda"))
	if err != nil {
		log.Fatal(err)
	}
}

// StLogout is a deauth method
func (p *Player) StLogout(w http.ResponseWriter, r *http.Request) {
	c, _ := r.Cookie("token")                  // err is irrelevant there
	t, _ := strconv.ParseUint(c.Value, 16, 64) // here's too
	ts.RejectToken(t)
}

func maxid() (u UserID, err error) {
	row := dbconn.QueryRow(`select max(id) from logins`)
	err = row.Scan(&u)
	if err != nil {
		return 0, err
	}
	return
}

func sesh(passw string) int32 {
	var hasher = sha512.New()
	hashs := hasher.Sum([]byte(passw))
	hash := int32(hashs[1]) |
		int32(hashs[2])<<8 |
		int32(hashs[3])<<16 |
		int32(hashs[4])<<24
	return hash
}

func errThenBreak(err error, w http.ResponseWriter, code int) bool {
	if err != nil {
		w.WriteHeader(code)
		w.Write([]byte(err.Error()))
		log.Println(err)
		return true
	}
	return false
}

// NewStudent creates a new student account with empty password
func (p *Player) NewStudent(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name string
	}
	var output struct {
		UserID
	}
	jd := json.NewDecoder(r.Body)
	je := json.NewEncoder(w)

	err := jd.Decode(&input)
	if errThenBreak(err, w, 400) {
		return
	}
	uid, err := maxid()
	if errThenBreak(err, w, 503) { // horrible style, but -1 line in every error handler!!!!
		return
	}
	query := `insert into logins (id, hash, names, role) values ($1, $2, $3, 1)`
	_, err = dbconn.Exec(query, uid+1, sesh(""), input.Name)
	if errThenBreak(err, w, 503) {
		return
	}
	w.WriteHeader(200)
	err = je.Encode(&output)
	errThenBreak(err, w, 503)
}

//*/
