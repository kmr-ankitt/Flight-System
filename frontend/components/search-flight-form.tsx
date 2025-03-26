"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface Airport {
  airport_id: number
  airport_code: string
  airport_name: string
  city: string
}

const formSchema = z
  .object({
    sourceAirport: z.string({
      required_error: "Please select a departure airport",
    }),
    destinationAirport: z.string({
      required_error: "Please select a destination airport",
    }),
    departureDate: z.date({
      required_error: "Please select a departure date",
    }),
  })
  .refine((data) => data.sourceAirport !== data.destinationAirport, {
    message: "Departure and destination airports cannot be the same",
    path: ["destinationAirport"],
  })

export function SearchFlightForm() {
  const router = useRouter()
  const [airports, setAirports] = useState<Airport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/airports")
        if (!response.ok) {
          throw new Error("Failed to fetch airports")
        }
        const data = await response.json()
        setAirports(data)
      } catch (error) {
        console.error("Error fetching airports:", error)
        toast({
          title: "Error",
          description: "Could not load airports. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAirports()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departureDate: new Date(),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedDate = format(values.departureDate, "yyyy-MM-dd")
    router.push(
      `/flights?source=${values.sourceAirport}&destination=${values.destinationAirport}&date=${formattedDate}`,
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Search Flights</h3>

          <FormField
            control={form.control}
            name="sourceAirport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Airport</FormLabel>
                <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select departure airport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {airports.map((airport) => (
                      <SelectItem key={airport.airport_id} value={airport.airport_id.toString()}>
                        {airport.airport_code} - {airport.city} ({airport.airport_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destinationAirport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Airport</FormLabel>
                <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select destination airport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {airports.map((airport) => (
                      <SelectItem key={airport.airport_id} value={airport.airport_id.toString()}>
                        {airport.airport_code} - {airport.city} ({airport.airport_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Departure Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full pl-3 text-left font-normal">
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02]"
          disabled={isLoading}
        >
          Search Flights
        </Button>
      </form>
    </Form>
  )
}

