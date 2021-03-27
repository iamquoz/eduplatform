package main

import (
	"log"
	"net/http"
)

func (p *Player) Flop(w http.ResponseWriter, r *http.Request) {
	_, err := w.Write([]byte("i'am wanted for war crimes in uganda"))
	if err != nil {
		log.Fatal(err)
	}
}

/*
func (p *Player) Students(w http.ResponseWriter, r *http.Request) {

}

func (p *Player) CreateStudent(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name string
	}
	var output struct {
		InviteLink string
	}
	buf := make([]byte, 512)
	json.Unmarshal(buf, input)
	query := `
	insert into table Logins
	`
}

func (p *Player) StGetTest(w http.ResponseWriter, r *http.Request) {

}
*/
