// components/sidebar.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart, Eye, Users, Home, Clipboard, Search, Settings, ShoppingBag, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function Sidebar() {
  const { theme, setTheme } = useTheme()

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
    <div className="w-64 border-r bg-background h-screen flex flex-col overflow-y-auto">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Eye className="h-6 w-6 animate-pulse" />
          Iris
        </h2>
        <p className="text-sm text-muted-foreground">Eyewear Management</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
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
        <Button variant="outline" className="w-full justify-start hover:bg-muted transition-colors duration-200">
          <Settings className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
          Settings
        </Button>
      </div>
    </div>
  )
}