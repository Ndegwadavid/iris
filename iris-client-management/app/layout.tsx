// app/layout.tsx
"use client"

import localFont from "next/font/local" // Use localFont instead of Google Fonts
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Eye, Menu, X, Home, Clipboard, Users, ShoppingBag, Search, BarChart, Moon, Sun, Settings } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTheme } from "next-themes"

// Define Inter using local font files from public/fonts
const inter = localFont({
  src: [
    {
      path: "../public/fonts/InterVariable.ttf", // Variable font for all weights
      weight: "100 900", // Variable font supports a range of weights
      style: "normal",
    },
    {
      path: "../public/fonts/interitalic.ttf", // Italic variant
      weight: "400", // Assuming regular weight for italic
      style: "italic",
    },
  ],
  variable: "--font-inter", // Optional: for custom CSS usage
  subsets: ["latin"], // Match your original subset
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen overflow-hidden">
            <div className="hidden md:block">
              <Sidebar />
            </div>
            <div className="flex flex-col w-full">
              <div className="md:hidden border-b p-4 flex items-center justify-between">
                <button className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  Iris
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-background border rounded-md"
                  onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                  aria-label="Toggle mobile menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
              <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>

              {/* Mobile Navigation Overlay */}
              <div
                className={cn(
                  "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col transform transition-all duration-300 ease-in-out md:hidden",
                  isMobileNavOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                )}
              >
                <div className="p-6 border-b flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary flex items-center gap-2">
                    <Eye className="h-6 w-6 animate-pulse" />
                    Iris
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-4">
                  <Link href="/" onClick={() => setIsMobileNavOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-muted transition-colors duration-200 group"
                    >
                      <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/reception" onClick={() => setIsMobileNavOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-muted transition-colors duration-200 group"
                    >
                      <Clipboard className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      Reception
                    </Button>
                  </Link>
                  <Link href="/examination" onClick={() => setIsMobileNavOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-muted transition-colors duration-200 group"
                    >
                      <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      Examination
                    </Button>
                  </Link>
                  <Link href="/sales" onClick={() => setIsMobileNavOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-muted transition-colors duration-200 group"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      Sales
                    </Button>
                  </Link>
                  <Link href="/clients" onClick={() => setIsMobileNavOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-muted transition-colors duration-200 group"
                    >
                      <Users className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      All Clients
                    </Button>
                  </Link>
                  <Link href="/existing-clients" onClick={() => setIsMobileNavOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-muted transition-colors duration-200 group"
                    >
                      <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      Existing Clients
                    </Button>
                  </Link>
                  <Link href="/admin" onClick={() => setIsMobileNavOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-muted transition-colors duration-200 group"
                    >
                      <BarChart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      Admin
                    </Button>
                  </Link>
                </nav>
                <div className="p-4 border-t space-y-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-muted transition-colors duration-200"
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark")
                      setIsMobileNavOpen(false)
                    }}
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-4 w-4 animate-spin-slow" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4 animate-spin-slow" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-muted transition-colors duration-200"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <Settings className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                    Settings
                  </Button>
                </div>
              </div>

              {/* Overlay */}
              {isMobileNavOpen && (
                <div
                  className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ease-in-out"
                  onClick={() => setIsMobileNavOpen(false)}
                  style={{ opacity: isMobileNavOpen ? 1 : 0 }}
                />
              )}
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}