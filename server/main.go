package main

import (
	"encoding/json"
	"fmt"
)

type Student struct {
	Name  string
	Score int
}

type Group struct {
	Teacher   string
	GroupName string
	Students  []Student
}

func main() {
	v := Group{
		Teacher:   "Булычева Юлия Владимировна",
		GroupName: "ДИПНРБ-21/1",
		Students: []Student{
			{
				Name:  "Коул Милена Ричардовна",
				Score: 310,
			},
			{
				Name:  "Досов Арман Руфатович",
				Score: -9999, // пососи.
			},
			{
				Name:  "Коколов Андрей Валерьевич",
				Score: 0,
			},
			{
				Name:  "Селимов Загидин Мурадович",
				Score: 9001,
			},
		},
	}
	s, _ := json.Marshal(v)
	fmt.Printf("%s\n", s)

}
