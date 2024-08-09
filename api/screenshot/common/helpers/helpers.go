package helpers

import (
		"encoding/json"
		"math/rand"
		"net/http"
		"os"
		"regexp"
)

func WriteJSON(rw http.ResponseWriter, sc int, v any) {
	rw.WriteHeader(sc)
	json.NewEncoder(rw).Encode(v)
}

func ValidateUrl(url string) string {
	var validUrl = regexp.MustCompile("^(http|https)://")

	if !validUrl.MatchString(url) {
		url = "http://" + url
	}

	return url
}

func GenerateRandomHash() string {
	var chars = []rune("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

	s := make([]rune, 6)
	for i := range s {
		s[i] = chars[rand.Intn(len(chars))]
	}

	return string(s)
}

type NoListFileSystem struct {
	Fsys http.FileSystem
}

func (fs NoListFileSystem) Open(name string) (http.File, error) {
	file, err := fs.Fsys.Open(name)
	if err != nil {
		return nil, err
	}

	info, err := file.Stat()
	if err != nil { 
		return nil, err 
	}
	if info.IsDir() {
		return nil, os.ErrNotExist
	}

	return file, nil
}