package classes

import ()

type Reservation struct {
	ReservationId int
	Room          Room
	User          User
	Time          TimeSlot
}
