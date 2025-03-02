import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart, Eye, Users, Home, Clipboard, Search, Settings, ShoppingBag, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function Sidebar() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="w-64 border-r bg-background h-screen flex flex-col overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Eye className="h-6 w-6" />
          Iris
        </h2>
        <p className="text-sm text-muted-foreground">Eyewear Management</p>
      </div>
      <div className="flex-1 px-3 py-2 space-y-1">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/reception">
          <Button variant="ghost" className="w-full justify-start">
            <Clipboard className="mr-2 h-4 w-4" />
            Reception
          </Button>
        </Link>
        <Link href="/examination">
          <Button variant="ghost" className="w-full justify-start">
            <Eye className="mr-2 h-4 w-4" />
            Examination
          </Button>
        </Link>
        <Link href="/sales">
          <Button variant="ghost" className="w-full justify-start">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Sales
          </Button>
        </Link>
        <Link href="/clients">
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            All Clients
          </Button>
        </Link>
        <Link href="/existing-clients">
          <Button variant="ghost" className="w-full justify-start">
            <Search className="mr-2 h-4 w-4" />
            Existing Clients
          </Button>
        </Link>
        <Link href="/admin">
          <Button variant="ghost" className="w-full justify-start">
            <BarChart className="mr-2 h-4 w-4" />
            Admin
          </Button>
        </Link>
      </div>
      <div className="p-4 border-t space-y-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              Dark Mode
            </>
          )}
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )
}

