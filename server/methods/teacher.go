package methods

import (
	"fmt"
	"log"

	"github.com/jackc/pgx"
)

// Teacher is a container entity for an authorized teacher.
// Other entities just can't call its methods and gets 404 trying.
type Teacher struct {
	ID          TeacherID
	Pool        *pgx.ConnPool
	InviteMaker func(ClassID) (string, error)
}

// Classes returns a list of all available classes
func (t *Teacher) Classes() map[ClassID]string {
	rows, err := t.Pool.Query("select ClassID, ClassName from ClassIndex where TeacherID = " + fmt.Sprint(t.ID))
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

	_, err := t.Pool.Query("insert into ClassIndex (ClassID, ClassName) values (" +
		fmt.Sprint(Last.ClassID, ", ", ClassName) + " )")
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
