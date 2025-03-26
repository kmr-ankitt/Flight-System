import { Suspense } from "react"
import { MyBookingsList } from "@/components/my-bookings-list"
import { MyBookingsSkeleton } from "@/components/my-bookings-skeleton"

export default function MyBookingsPage() {
  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <Suspense fallback={<MyBookingsSkeleton />}>
        <MyBookingsList />
      </Suspense>
    </div>
  )
}

