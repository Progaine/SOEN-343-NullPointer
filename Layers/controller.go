package main

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"

	"github.com/Skellyboy38/SOEN-343-NullPointer/Layers/domain_layer/handler"
	"github.com/Skellyboy38/SOEN-343-NullPointer/Layers/domain_layer/mappers"
	"github.com/gorilla/mux"
)

func main() {
	fmt.Println("Application started")
	router := mux.NewRouter()
	err := startDb()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Db started")
	mappers.Init()
	mappers.InitUOW()
	router.PathPrefix("/js/").Handler(http.StripPrefix("/js/", http.FileServer(http.Dir("./presentation_layer/js"))))
	router.PathPrefix("/images/").Handler(http.StripPrefix("/images/", http.FileServer(http.Dir("./presentation_layer/images"))))
	router.PathPrefix("/css/").Handler(http.StripPrefix("/css/", http.FileServer(http.Dir("./presentation_layer/css"))))
	router.HandleFunc("/login", handler.LoginGet).Methods("GET")
	router.HandleFunc("/", handler.LoginGet).Methods("GET")
	router.HandleFunc("/login", handler.LoginForm).Methods("POST")
	router.HandleFunc("/createReservation", handler.CreateReservation).Methods("POST")
	router.HandleFunc("/addToWaitList", handler.AddToWaitList).Methods("POST")
	router.HandleFunc("/getWaitListEntriesByRoom", handler.GetWaitListEntriesByRoom).Methods("POST")
	router.HandleFunc("/removeWaitListEntriesById", handler.RemoveWaitListEntriesById).Methods("POST")
	router.HandleFunc("/getWaitListEntriesByUserId", handler.GetWaitListReservationsByUserID).Methods("POST")
	router.HandleFunc("/reservationsByRoom", handler.GetReservationsByRoomID).Methods("POST")
	router.HandleFunc("/reservationsByUser", handler.GetReservationsByUserID).Methods("POST")
	router.HandleFunc("/deleteReservation", handler.DeleteReservation).Methods("POST")
	router.HandleFunc("/updateReservation", handler.UpdateReservation).Methods("POST")
	router.HandleFunc("/reservationsOthers", handler.GetReservationsOthers).Methods("POST")
	router.HandleFunc("/home", handler.Home).Methods("POST")
	router.HandleFunc("/home", handler.Home).Methods("GET")
	// TODO - Delete unused routes
	router.HandleFunc("/jsonexample", handler.ReturnJson).Methods("GET")
	router.HandleFunc("/testDbConnection", handler.TestDb).Methods("GET")
	router.HandleFunc("/testcookie", handler.TestCookie).Methods("GET")
	router.HandleFunc("/getcookie", handler.GetCookie).Methods("GET")
	http.Handle("/", router)
	log.Fatal(http.ListenAndServe(":9000", nil))
}

func startDb() error {
	path, err := exec.LookPath("pg_ctl.exe")
	if err != nil {
		return err
	}
	cmd := exec.Command(path, "-D", "data_source_layer/setup/registry", "start")
	return cmd.Run()
}
