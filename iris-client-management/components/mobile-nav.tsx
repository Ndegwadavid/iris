// components/mobile-nav.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart, Eye, Users, Home, Clipboard, Search, Settings, ShoppingBag, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

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
          size="icon"
          className="bg-background border rounded-md"
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r flex flex-col transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "md:hidden"
          )}
        >
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Eye className="h-6 w-6 animate-pulse" />
              Iris
            </h2>
            <p className="text-sm text-muted-foreground">Eyewear Management</p>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-2">
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
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  )
}