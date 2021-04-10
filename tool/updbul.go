package main

import (
	"crypto/sha512"
	"fmt"
	"os"
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
	fmt.Println(hash)
}
