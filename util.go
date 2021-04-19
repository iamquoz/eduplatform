package main

import (
	"bytes"
	"crypto/sha512"
	"encoding/gob"
)

func maxid(tab string) (u int, err error) {
	row := dbconn.QueryRow(`select max(id) from ` + tab)
	err = row.Scan(&u)
	if err != nil {
		return 0, err
	}
	return
}

func maxtaid() (id TaskID, err error) {
	row := dbconn.QueryRow(`select max(id) from tasks`)
	err = row.Scan(&id)
	if err != nil {
		return 0, err
	}
	return
}

// sesh gets a hash of password string.
func sesh(passw string) int32 {
	var hasher = sha512.New()
	hashs := hasher.Sum([]byte(passw))
	hash := int32(hashs[1]) |
		int32(hashs[2])<<8 |
		int32(hashs[3])<<16 |
		int32(hashs[4])<<24
	return hash
}

func task2gob(tk *Task) ([]byte, error) {
	buf := bytes.NewBuffer(make([]byte, 0, TaskLength))
	ge := gob.NewEncoder(buf)
	err := ge.Encode(tk)
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func gob2task(btk []byte) (tk *Task, err error) {
	gd := gob.NewDecoder(bytes.NewBuffer(btk))
	tk = new(Task)
	err = gd.Decode(tk)
	return
}

func theory2gob(th *Theory) ([]byte, error) {
	buf := bytes.NewBuffer(make([]byte, 0, TaskLength))
	ge := gob.NewEncoder(buf)
	err := ge.Encode(th)
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func gob2theory(btk []byte) (th *Theory, err error) {
	gd := gob.NewDecoder(bytes.NewBuffer(btk))
	th = new(Theory)
	err = gd.Decode(th)
	return
}
