import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import { Plane } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlightBook - Book Your Flights",
  description: "A simple flight booking system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className=" flex h-14 items-center justify-between px-4 md:px-6 ">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                  <Plane className="h-6 w-6" />
                  <span className="hidden font-bold sm:inline-block">FlightBook</span>
                </Link>
                <nav className="flex items-center space-x-6 text-base font-medium">
                  <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">
                    Home
                  </Link>
                  <Link href="/flights" className="transition-colors hover:text-foreground/80 text-foreground/60">
                    Flights
                  </Link>
                  <Link href="/my-bookings" className="transition-colors hover:text-foreground/80 text-foreground/60">
                    My Bookings
                  </Link>
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-0">
              <div className="flex flex-col items-center justify-center gap-4 md:h-14 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  © {new Date().getFullYear()} FlightBook. All rights reserved.
                </p>
              </div>
            </footer>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'