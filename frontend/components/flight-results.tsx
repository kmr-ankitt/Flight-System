import Link from "next/link"
import { format, parseISO } from "date-fns"
import { ArrowDown, ArrowUp, Plane } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDuration } from "@/lib/utils"

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

export async function FlightResults({
  sourceId,
  destinationId,
  date,
  sort = "departure_time",
  order = "asc",
}: {
  sourceId?: string
  destinationId?: string
  date?: string
  sort?: string
  order?: string
}) {
  const [flights, airports] = await Promise.all([getFlights(), getAirports()])

  const airportMap = new Map<number, Airport>()
  airports.forEach((airport: Airport) => {
    airportMap.set(airport.airport_id, airport)
  })

  // Filter flights based on query parameters
  let filteredFlights = flights

  if (sourceId) {
    filteredFlights = filteredFlights.filter((flight: Flight) => flight.source_airport_id.toString() === sourceId)
  }

  if (destinationId) {
    filteredFlights = filteredFlights.filter(
      (flight: Flight) => flight.destination_airport_id.toString() === destinationId,
    )
  }

  if (date) {
    filteredFlights = filteredFlights.filter((flight: Flight) => {
      const flightDate = new Date(flight.departure_time).toISOString().split("T")[0]
      return flightDate === date
    })
  }

  // Sort flights
  const validSortFields = ["departure_time", "arrival_time", "seats_available"]
  const sortField = validSortFields.includes(sort) ? sort : "departure_time"
  const sortOrder = order === "desc" ? -1 : 1

  filteredFlights.sort((a: any, b: any) => {
    if (sortField === "departure_time" || sortField === "arrival_time") {
      return (new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime()) * sortOrder
    }
    return (a[sortField] - b[sortField]) * sortOrder
  })

  const toggleSort = (field: string) => {
    if (field === sort) {
      return order === "asc" ? "desc" : "asc"
    }
    return "asc"
  }

  const getSortURL = (field: string) => {
    const newOrder = toggleSort(field)
    const searchParams = new URLSearchParams()

    if (sourceId) searchParams.set("source", sourceId)
    if (destinationId) searchParams.set("destination", destinationId)
    if (date) searchParams.set("date", date)
    searchParams.set("sort", field)
    searchParams.set("order", newOrder)

    return `/flights?${searchParams.toString()}`
  }

  const getSortIcon = (field: string) => {
    if (field !== sort) return null

    return order === "asc" ? <ArrowUp className="ml-1 h-4 w-4 inline" /> : <ArrowDown className="ml-1 h-4 w-4 inline" />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {filteredFlights.length} {filteredFlights.length === 1 ? "flight" : "flights"} found
        </h2>
        <div className="flex space-x-2 text-sm">
          <span className="font-medium">Sort by: </span>
          <Link href={getSortURL("departure_time")} className="text-primary hover:underline">
            Departure {getSortIcon("departure_time")}
          </Link>
          <Link href={getSortURL("arrival_time")} className="text-primary hover:underline">
            Arrival {getSortIcon("arrival_time")}
          </Link>
          <Link href={getSortURL("seats_available")} className="text-primary hover:underline">
            Seats {getSortIcon("seats_available")}
          </Link>
        </div>
      </div>

      {filteredFlights.length === 0 ? (
        <div className="text-center py-12">
          <Plane className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No flights found</h3>
          <p className="text-muted-foreground mb-6">Try changing your search parameters to find available flights.</p>
          <Button asChild>
            <Link href="/">Search Again</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredFlights.map((flight: Flight) => {
            const sourceAirport = airportMap.get(flight.source_airport_id)
            const destinationAirport = airportMap.get(flight.destination_airport_id)
            const departureTime = parseISO(flight.departure_time)
            const arrivalTime = parseISO(flight.arrival_time)
            const durationMs = arrivalTime.getTime() - departureTime.getTime()

            if (!sourceAirport || !destinationAirport) {
              return null
            }

            return (
              <Card key={flight.flight_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-muted pb-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{flight.flight_code}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                    <div>
                      <div className="text-2xl font-bold">{format(departureTime, "HH:mm")}</div>
                      <div className="text-sm text-muted-foreground">{format(departureTime, "dd MMM yyyy")}</div>
                      <div className="font-medium mt-1">{sourceAirport.airport_code}</div>
                      <div className="text-sm text-muted-foreground">{sourceAirport.city}</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-sm font-medium text-muted-foreground">{formatDuration(durationMs)}</div>
                      <div className="relative w-24 md:w-32 h-[2px] bg-muted-foreground/30 my-2">
                        <div className="absolute top-[-4px] right-[-4px] w-2 h-2 rounded-full bg-muted-foreground"></div>
                        <div className="absolute top-[-4px] left-[-4px] w-2 h-2 rounded-full bg-muted-foreground"></div>
                      </div>
                      <div className="text-xs text-muted-foreground">Direct</div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold">{format(arrivalTime, "HH:mm")}</div>
                      <div className="text-sm text-muted-foreground">{format(arrivalTime, "dd MMM yyyy")}</div>
                      <div className="font-medium mt-1">{destinationAirport.airport_code}</div>
                      <div className="text-sm text-muted-foreground">{destinationAirport.city}</div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                    >
                      <Link href={`/book/${flight.flight_id}`}>Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

