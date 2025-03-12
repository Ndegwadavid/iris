"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart, Eye, Users, Home, Clipboard, Search, Settings, ShoppingBag, Moon, Sun, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { useToast } from "@/components/ui/use-toast"

export function Sidebar() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()

  const SIGNOUT_URL = "http://127.0.0.1:8000/api/v001/auth/signout/"

  const navItems = [
    { href: "/reception", icon: Clipboard, label: "Reception" },
    { href: "/examination", icon: Eye, label: "Examination" },
    { href: "/sales", icon: ShoppingBag, label: "Sales" },
    { href: "/clients", icon: Users, label: "All Clients" },
    { href: "/existing-clients", icon: Search, label: "Existing Clients" },
    { href: "/admin", icon: BarChart, label: "Admin" },
  ]

  const handleLogout = async () => {
    try {
      const response = await fetch(SIGNOUT_URL, {
        method: "POST",
        credentials: "include",
      })
      if (response.ok) {
        toast({ title: "Signed out successfully" })
        router.push("/")
      } else {
        throw new Error("Logout failed")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    }
  }

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
        <Button
          variant="outline"
          className="w-full justify-start hover:bg-muted transition-colors duration-200"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}