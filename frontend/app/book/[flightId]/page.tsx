import { notFound } from "next/navigation"
import { BookingForm } from "@/components/booking-form"
import { Card, CardContent } from "@/components/ui/card"
import { format, parseISO } from "date-fns"

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

async function getFlight(flightId: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/flights`, { cache: "no-store" })
    if (!res.ok) {
      throw new Error("Failed to fetch flights")
    }

    const flights = await res.json()
    const flight = flights.find((f: Flight) => f.flight_id.toString() === flightId)

    if (!flight) {
      return null
    }

    return flight
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

export default async function BookPage({ params }: { params: { flightId: string } }) {
  const [flight, airports] = await Promise.all([getFlight(params.flightId), getAirports()])

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

  return (
    <div className="container px-4 py-8 mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Book Your Flight</h1>

      <Card className="mb-8 bg-muted/30">
        <CardContent className="pt-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">{flight.flight_code}</h2>
            <p className="text-sm text-muted-foreground mb-4">{format(departureTime, "EEEE, MMMM d, yyyy")}</p>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div>
              <div className="text-lg font-semibold">{format(departureTime, "HH:mm")}</div>
              <div className="font-medium">{sourceAirport.airport_code}</div>
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
              <div className="font-medium">{destinationAirport.airport_code}</div>
              <div className="text-sm text-muted-foreground">{destinationAirport.city}</div>
            </div>
          </div>

          <div className="mt-4 text-sm">
            <span
              className={`px-2 py-1 rounded-full ${
                flight.seats_available > 10
                  ? "bg-green-100 text-green-800"
                  : flight.seats_available > 0
                    ? "bg-orange-100 text-orange-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {flight.seats_available} {flight.seats_available === 1 ? "seat" : "seats"} available
            </span>
          </div>
        </CardContent>
      </Card>

      <BookingForm flightId={flight.flight_id} />
    </div>
  )
}

