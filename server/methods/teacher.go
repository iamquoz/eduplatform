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
	InviteMaker func(ClassID) string
}

// Classes returns a list of all available classes
func (t *Teacher) Classes() map[ClassID]string {
	rows, err := t.Pool.Query("select ClassID, ClassName from Index where TeacherID = " + fmt.Sprint(t.ID))
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
func (t *Teacher) NewClass() (ClassID, string) {

}
