package main

import (
	"log"

	"github.com/jackc/pgx"
)

// Teacher is a container entity for an authorized teacher.
// Other entities just can't call its methods and gets 404 trying.
type Teacher struct {
	ID          UserID
	pool        *pgx.ConnPool
	InviteMaker func(ClassID) (string, error)
}

// Classes returns a list of all available classes
func (t *Teacher) Classes() map[ClassID]string {
	rows, err := t.pool.Query(`
		select ClassID, ClassName 
		from ClassIndex 
		where TeacherID = $1;`,
		t.ID)
	if err != nil {
		log.Print(err)
		return nil
	}
	mp := make(map[ClassID]string, 0)
	for rows.Next() {
		var cld ClassID
		var name string
		rows.Scan(cld, name)
		mp[cld] = name
	}
	return mp
}

// NewClass creates a new class and returns a headman invite link
func (t *Teacher) NewClass(ClassName string) (ClassID, string) {
	Last.Lock()
	Last.ClassID++
	Last.Unlock()

	_, err := t.pool.Query(`
		insert
		into ClassIndex (ClassID, Name)
		values ($1, $2);`,
		Last.ClassID, ClassName)
	if err != nil {
		log.Print(err)
		return 0, ""
	}

	s, err := t.InviteMaker(Last.ClassID)
	if err != nil {
		log.Print(err)
		return 0, ""
	}
	return Last.ClassID, s
}

// NewCurriculum creates a new curriculum
// Curriculums are not stored in DB, rather as pure markup files uploaded by the teacher
func (t *Teacher) NewCurriculum(name string) CurriculumID {
	Last.Lock()
	Last.CurriculumID++
	Last.Unlock()
	// TODO impl
	return 0
}
