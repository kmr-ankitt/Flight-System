import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function FlightResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-7 w-36" />
        <div className="flex space-x-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                <div>
                  <Skeleton className="h-8 w-20 mb-1" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-5 w-12 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>

                <div className="flex flex-col items-center">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <div className="relative w-24 md:w-32 h-[2px] bg-muted my-2">
                    <div className="absolute top-[-4px] right-[-4px] w-2 h-2 rounded-full bg-muted"></div>
                    <div className="absolute top-[-4px] left-[-4px] w-2 h-2 rounded-full bg-muted"></div>
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>

                <div className="text-right">
                  <Skeleton className="h-8 w-20 mb-1 ml-auto" />
                  <Skeleton className="h-4 w-24 mb-2 ml-auto" />
                  <Skeleton className="h-5 w-12 mb-1 ml-auto" />
                  <Skeleton className="h-4 w-20 ml-auto" />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Skeleton className="h-10 w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

