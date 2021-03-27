package main

import (
	"context"
	"crypto/sha512"
	"fmt"
	"os"

	"github.com/jackc/pgx"
)

func main() {
	var hasher = sha512.New()
	passw := make([]byte, 512)
	n, _ := os.Stdin.Read(passw)
	passw = passw[0:n]
	hashs := hasher.Sum(passw)
	hash := int32(hashs[1]) |
		int32(hashs[2])<<8 |
		int32(hashs[3])<<16 |
		int32(hashs[4])<<24
	conn, err := pgx.Connect(context.Background(), "postgres://localhost:5432/postgres")
	if err != nil {
		panic(err)
	}
	defer conn.Close(context.Background())
	_, err = conn.Exec(context.Background(), "update Logins set hash=$1 where Id=1", hash)
	if err != nil {
		panic(err)
	}
	fmt.Println()
	fmt.Println(hash)
}
