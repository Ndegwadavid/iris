"use client"

import localFont from "next/font/local"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Eye, Menu, X, Home, Clipboard, Users, ShoppingBag, Search, BarChart, Settings, Bell, MessageSquare, Building2, LayoutDashboard, FileText, LogOut } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const inter = localFont({
  src: [
    {
      path: "../public/fonts/InterVariable.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../public/fonts/interitalic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-inter"
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isAdminRoute = pathname.startsWith("/admin")

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    router.push("/admin/login")
    setIsMobileNavOpen(false)
  }

  const AdminSidebar = () => (
    <div className="w-64 border-r flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          Admin Panel
        </h2>
      </div>
      <div className="flex-1 p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Staff Management
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <FileText className="mr-2 h-4 w-4" />
          Reports
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
      <div className="p-4 border-t space-y-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="hidden md:block">
              {isAdminRoute ? <AdminSidebar /> : <Sidebar />}
            </div>
            <div className="flex flex-col w-full">
              {/* Top Bar */}
              <header className="border-b p-4 flex items-center justify-between bg-background sticky top-0 z-50">
                {/* Mobile Hamburger */}
                <div className="md:hidden">
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

                {/* Logo (Desktop) */}
                <div className="hidden md:flex items-center gap-2">
                  <Eye className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold text-primary">Iris</span>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-md mx-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search clients, orders..."
                      className="pl-10 w-full rounded-full border-2 border-muted focus:border-primary transition-colors shadow-sm"
                    />
                  </div>
                </div>

                {/* Right Side: System Status, Notifications, Profile, Chat */}
                <div className="flex items-center gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5l-2-2 1-1 1 1 3-3 1 1-4 4z" />
                        </svg>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2 border-2 border-muted rounded-lg shadow-lg">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm">System Status</h3>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                          All Systems Operational
                        </p>
                        <p className="text-xs text-muted-foreground">Last checked: {new Date().toLocaleTimeString()}</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">3</Badge>
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full p-1">
                        <Image
                          src="/images/davy.png"
                          alt="Profile"
                          width={24}
                          height={24}
                          className="rounded-full object-cover"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2 border-2 border-muted rounded-lg shadow-lg">
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" className="justify-start text-left hover:bg-muted" asChild>
                          <Link href="/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Link>
                        </Button>
                        <Button variant="ghost" className="justify-start text-left hover:bg-muted">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Premium
                        </Button>
                        <Button variant="ghost" className="justify-start text-left hover:bg-muted text-destructive">
                          <X className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsChatOpen(!isChatOpen)}>
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 border-2 border-muted rounded-lg shadow-lg bg-background" align="end">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          Support Chat
                        </h3>
                        <div className="bg-muted/20 p-3 rounded-lg text-sm">
                          <p>Hello! How can I assist you today?</p>
                          <p className="text-xs text-muted-foreground mt-1">— Iris Support Bot</p>
                        </div>
                        <div className="flex gap-2">
                          <Input placeholder="Type a message..." className="flex-1" />
                          <Button size="sm" className="bg-primary text-primary-foreground">
                            Send
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </header>

              {/* Main Content */}
              <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>

              {/* Mobile Navigation Overlay */}
              <div
                className={cn(
                  "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col transform transition-all duration-300 ease-in-out md:hidden",
                  isMobileNavOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                )}
              >
                {isAdminRoute ? (
                  <>
                    <div className="p-6 border-b flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Building2 className="h-6 w-6 animate-pulse" />
                        Admin Panel
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileNavOpen(false)}
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </div>
                    <nav className="flex-1 p-4 space-y-4">
                      <Button variant="ghost" className="w-full justify-start">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        Staff Management
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Reports
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </nav>
                    <div className="p-4 border-t space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-sm text-muted-foreground">Theme</span>
                        <ThemeToggle />
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
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
                        variant="outline"
                        className="w-full justify-start hover:bg-muted transition-colors duration-200"
                        onClick={() => setIsMobileNavOpen(false)}
                      >
                        <Settings className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                        Settings
                      </Button>
                    </div>
                  </>
                )}
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