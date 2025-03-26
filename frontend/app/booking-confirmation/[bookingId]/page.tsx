import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO } from "date-fns"
import { CheckCircle2, Plane } from "lucide-react"

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

async function getBooking(bookingId: string) {
  try {
    const res = await fetch("http://localhost:4000/api/bookings", { cache: "no-store" })
    if (!res.ok) {
      throw new Error("Failed to fetch bookings")
    }

    const bookings = await res.json()
    const booking = bookings.find((b: Booking) => b.booking_id.toString() === bookingId)

    if (!booking) {
      return null
    }

    return booking
  } catch (error) {
    console.error("Error fetching booking:", error)
    return null
  }
}

async function getFlight(flightId: number) {
  try {
    const res = await fetch(`http://localhost:4000/api/flights`, { cache: "no-store" })
    if (!res.ok) {
      throw new Error("Failed to fetch flights")
    }

    const flights = await res.json()
    return flights.find((f: Flight) => f.flight_id === flightId) || null
  } catch (error) {
    console.error("Error fetching flight:", error)
    return null
  }
}

async function getAirports() {
  try {
    const res = await fetch("http://localhost:4000/api/airports", { cache: "no-store" })
    if (!res.ok) {
      throw new Error("Failed to fetch airports")
    }
    return res.json()
  } catch (error) {
    console.error("Error fetching airports:", error)
    return []
  }
}

export default async function BookingConfirmationPage({ params }: { params: { bookingId: string } }) {
  // Validate bookingId parameter
  if (!params.bookingId || params.bookingId === "undefined") {
    notFound()
  }

  const booking = await getBooking(params.bookingId)

  if (!booking) {
    notFound()
  }

  const [flight, airports] = await Promise.all([getFlight(booking.flight_id), getAirports()])

  if (!flight) {
    notFound()
  }

  const airportMap = new Map<number, Airport>()
  airports.forEach((airport: Airport) => {
    airportMap.set(airport.airport_id, airport)
  })

  const sourceAirport = airportMap.get(flight.source_airport_id)
  const destinationAirport = airportMap.get(flight.destination_airport_id)

  if (!sourceAirport || !destinationAirport) {
    notFound()
  }

  const departureTime = parseISO(flight.departure_time)
  const arrivalTime = parseISO(flight.arrival_time)
  const bookingDate = parseISO(booking.booking_date)

  return (
    <div className="container px-4 py-8 mx-auto max-w-3xl">
      <div className="text-center mb-8">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground">
          Your booking has been successfully confirmed. Details are provided below.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader className="bg-muted/30">
          <CardTitle className="flex justify-between items-center">
            <span>Booking #{booking.booking_id}</span>
            <span className="text-sm text-muted-foreground">
              Booked on {format(bookingDate, "MMMM d, yyyy 'at' HH:mm")}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Flight Details</h2>
              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Plane className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">{flight.flight_code}</span>
                </div>

                <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                  <div>
                    <div className="text-lg font-semibold">{format(departureTime, "HH:mm")}</div>
                    <div className="text-sm text-muted-foreground">{format(departureTime, "dd MMM yyyy")}</div>
                    <div className="font-medium mt-1">{sourceAirport.airport_code}</div>
                    <div className="text-sm text-muted-foreground">{sourceAirport.city}</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative w-16 md:w-24 h-[2px] bg-muted-foreground/30 my-2">
                      <div className="absolute top-[-4px] right-[-4px] w-2 h-2 rounded-full bg-muted-foreground"></div>
                      <div className="absolute top-[-4px] left-[-4px] w-2 h-2 rounded-full bg-muted-foreground"></div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold">{format(arrivalTime, "HH:mm")}</div>
                    <div className="text-sm text-muted-foreground">{format(arrivalTime, "dd MMM yyyy")}</div>
                    <div className="font-medium mt-1">{destinationAirport.airport_code}</div>
                    <div className="text-sm text-muted-foreground">{destinationAirport.city}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Passenger Information</h2>
              <div className="bg-muted/20 p-4 rounded-lg space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <p className="font-medium">{booking.passenger_name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <p className="font-medium">{booking.passenger_email}</p>
                </div>
                {booking.passenger_phone && (
                  <div>
                    <span className="text-sm text-muted-foreground">Phone:</span>
                    <p className="font-medium">{booking.passenger_phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/my-bookings">View All My Bookings</Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}

