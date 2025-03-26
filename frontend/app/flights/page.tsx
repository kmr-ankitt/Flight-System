import { Suspense } from "react"
import { FlightResults } from "@/components/flight-results"
import { FlightResultsSkeleton } from "@/components/flight-results-skeleton"

export default function FlightsPage({
  searchParams,
}: {
  searchParams: { source?: string; destination?: string; date?: string; sort?: string; order?: string }
}) {
  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Available Flights</h1>
      <Suspense fallback={<FlightResultsSkeleton />}>
        <FlightResults
          sourceId={searchParams.source}
          destinationId={searchParams.destination}
          date={searchParams.date}
          sort={searchParams.sort}
          order={searchParams.order}
        />
      </Suspense>
    </div>
  )
}

