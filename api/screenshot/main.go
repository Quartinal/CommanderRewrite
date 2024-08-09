package main

import (
		"fmt"
		"log"

		"github.com/Quartinal/CommanderScreenshotAPI/api"
		"github.com/joho/godotenv"
)

func main() {
	envFile, _ := godotenv.Read(".env.prod")

	port := envFile["PORT"]

	server := api.NewServer(fmt.Sprintf(":%s", port))

	fmt.Printf("[INFO] Server started on port \"%s\"\n", server.Addr)

	err := server.ListenAndServe()
	if err != nil {
		log.SetPrefix("[ERROR]")
		log.Printf("Error occurred when starting the server: %s", err)
	}
}