// components/mobile-nav.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart, Eye, Users, Home, Clipboard, Search, Settings, ShoppingBag, Menu, X, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleMenu = () => setIsOpen(!isOpen)

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/reception", icon: Clipboard, label: "Reception" },
    { href: "/examination", icon: Eye, label: "Examination" },
    { href: "/sales", icon: ShoppingBag, label: "Sales" },
    { href: "/clients", icon: Users, label: "All Clients" },
    { href: "/existing-clients", icon: Search, label: "Existing Clients" },
    { href: "/admin", icon: BarChart, label: "Admin" },
  ]

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden border-b p-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-primary flex items-center gap-2">
          <Eye className="h-6 w-6" />
          Iris
        </span>
        <Button
  variant="ghost"
  className="w-full justify-start hover:bg-muted transition-colors duration-200"
  onClick={() => {
    console.log("Mobile theme toggle:", theme, "to", theme === "dark" ? "light" : "dark")
    setTheme(theme === "dark" ? "light" : "dark")
  }}
>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col transform transition-all duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        )}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Eye className="h-6 w-6 animate-pulse" />
            Iris
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-left hover:bg-muted transition-colors duration-200 group"
              >
                <item.icon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-muted transition-colors duration-200"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
            onClick={() => setIsOpen(false)}
          >
            <Settings className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
            Settings
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ease-in-out"
          onClick={toggleMenu}
          style={{ opacity: isOpen ? 1 : 0 }}
        />
      )}
    </>
  )
}