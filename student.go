package main

import (
	"fmt"
	"log"
)

// StLogout is a deauth method
func (p *Player) StLogout() {
	ts.RejectToken(p.Token)
}

// StGetTask returns a task by id. Any user can get any task, this is
// not intentional. Probably needs to be fixed.
func (p *Player) StGetTask(id TaskID) *Task {
	v, err := tes.ReadTask(id)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return v
}

// StRegister changes password for a user
func (p *Player) StRegister(new String) {
	query := `update logins set hash = $1 where id = $2`
	_, err := dbconn.Exec(query, sesh(string(new)), p.StudentID)
	if err != nil {
		log.Print(err)
	}
}
