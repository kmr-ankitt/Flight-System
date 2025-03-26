import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format, parseISO } from "date-fns"
import { ClipboardList } from "lucide-react"

interface Booking {
  booking_id: number
  flight_id: number
  passenger_name: string
  passenger_email: string
  passenger_phone?: string
  booking_date: string
}

interface Flight {
  flight_id: number
  flight_code: string
  source_airport_id: number
  destination_airport_id: number
  departure_time: string
  arrival_time: string
  seats_available: number
}

interface Airport {
  airport_id: number
  airport_code: string
  airport_name: string
  city: string
}

async function getBookings() {
  const res = await fetch("http://localhost:4000/api/bookings", { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Failed to fetch bookings")
  }
  return res.json()
}

async function getFlights() {
  const res = await fetch("http://localhost:4000/api/flights", { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Failed to fetch flights")
  }
  return res.json()
}

async function getAirports() {
  const res = await fetch("http://localhost:4000/api/airports", { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Failed to fetch airports")
  }
  return res.json()
}

export async function MyBookingsList() {
  const [bookings, flights, airports] = await Promise.all([getBookings(), getFlights(), getAirports()])

  const flightMap = new Map<number, Flight>()
  flights.forEach((flight: Flight) => {
    flightMap.set(flight.flight_id, flight)
  })

  const airportMap = new Map<number, Airport>()
  airports.forEach((airport: Airport) => {
    airportMap.set(airport.airport_id, airport)
  })

  // Sort bookings by booking date descending
  bookings.sort((a: Booking, b: Booking) => {
    return new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
  })

  return (
    <div>
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No bookings found</h3>
          <p className="text-muted-foreground mb-6">You haven't made any bookings yet. Start by booking a flight.</p>
          <Button asChild>
            <Link href="/">Find Flights</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Flight</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Passenger</TableHead>
                  <TableHead>Booking Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking: Booking) => {
                  const flight = flightMap.get(booking.flight_id)

                  if (!flight) return null

                  const sourceAirport = airportMap.get(flight.source_airport_id)
                  const destinationAirport = airportMap.get(flight.destination_airport_id)

                  if (!sourceAirport || !destinationAirport) return null

                  const departureTime = parseISO(flight.departure_time)
                  const bookingDate = parseISO(booking.booking_date)

                  return (
                    <TableRow key={booking.booking_id}>
                      <TableCell className="font-medium">#{booking.booking_id}</TableCell>
                      <TableCell>{flight.flight_code}</TableCell>
                      <TableCell>
                        {sourceAirport.airport_code} → {destinationAirport.airport_code}
                      </TableCell>
                      <TableCell>{format(departureTime, "dd MMM yyyy HH:mm")}</TableCell>
                      <TableCell>{booking.passenger_name}</TableCell>
                      <TableCell>{format(bookingDate, "dd MMM yyyy")}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/booking-confirmation/${booking.booking_id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

