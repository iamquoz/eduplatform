package main

import (
	"log"
)

// Flop is a test method, it returns a string to check that server is working correctly
func (p *Player) Flop() String {
	return "i am wanted for war crimes in uganda"
}

// Echo is an another test method, it adds 1 to the input and returns it
func (p *Player) Echo(i Int) Int {
	return i + 1
}

// AddStudent creates a new student account with empty password.
func (p *Player) AddStudent(name String, uid StudentID) {
	query := `insert into logins (id, hash, names, role) values ($1, $2, $3, 1)`
	_, err := dbconn.Exec(query, uid+1, sesh(""), name)
	if err != nil {
		log.Print(err)
	}
}

func ZapStudent(StudentID) {

}

// GetStudents returns a list of all students
func (p *Player) GetStudents() MapUserIDString {
	query := `select (id, names) from logins`
	rows, err := dbconn.Query(query)
	if err != nil {
		log.Print(err)
		return nil
	}
	m := make(MapUserIDString)
	for rows.Next() {
		var uid StudentID
		var names string
		rows.Scan(&uid, &names)
		m[uid] = names
	}
	return m
}

//*/
