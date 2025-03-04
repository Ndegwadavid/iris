"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/utils/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Building2,
  LayoutDashboard,
  Glasses,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  MessageSquare,
  AlertTriangle,
  UserPlus,
  FileText,
  Menu,
  X,
  Clock,
  Shield,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState("operational");
  const [pendingTasks, setPendingTasks] = useState(3);

  useEffect(() => {
    // Authentication check
    if (pathname === "/admin/login") return;
    if (!isAuthenticated()) {
      router.push("/admin/login");
    }

    // Simulate real-time updates
    const statusInterval = setInterval(() => {
      setPendingTasks(Math.floor(Math.random() * 5));
    }, 30000);
    return () => clearInterval(statusInterval);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    router.push("/admin/login");
    setIsMobileNavOpen(false);
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Enhanced Top Bar */}
      <header className="border-b px-4 py-3 flex items-center justify-between bg-background sticky top-0 z-50 shadow-sm flex-wrap gap-2">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-lg font-bold text-primary hidden sm:block">Admin Iris</span>
          </div>
        </div>

        {/* Search - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients, inventory, reports..."
              className="pl-8 w-full rounded-md border border-muted focus:border-primary"
            />
          </div>
        </div>

        {/* Enhanced Right Section */}
        <div className="flex items-center gap-2">
          {/* Quick Action Button - Mobile Only */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Plus className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/admin/clients/new")}>
                <Users className="mr-2 h-4 w-4" />
                Add Client
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/inventory/new")}>
                <Glasses className="mr-2 h-4 w-4" />
                Add Inventory
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* System Status Monitor */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
                <Shield className={`h-4 w-4 ${systemStatus === "operational" ? "text-green-500" : "text-yellow-500"}`} />
                <span className="text-xs">{systemStatus === "operational" ? "All Good" : "Issues"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">System Monitor</h4>
                  <Button variant="ghost" size="sm" onClick={() => setSystemStatus("operational")}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`h-2 w-2 rounded-full ${systemStatus === "operational" ? "bg-green-500" : "bg-yellow-500"} animate-pulse`} />
                  <span>{systemStatus === "operational" ? "All Systems Operational" : "Minor Issues Detected"}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  CPU: 65% | Memory: 72% | Uptime: 99.9%
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View Detailed Status
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Admin Alerts */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-yellow-500">
                  {pendingTasks}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Admin Alerts</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Low Inventory: {pendingTasks} items</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Pending Approvals: 2</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Overdue Tasks: 1</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Manage Alerts
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Real-time Clock */}
          <div className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">5</Badge>
          </Button>

          {/* Quick Actions - Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span className="text-sm">Quick Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push("/admin/clients/new")}>
                <Users className="mr-2 h-4 w-4" />
                Add Client
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/inventory/new")}>
                <Glasses className="mr-2 h-4 w-4" />
                Add Inventory
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/reports")}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 hidden md:block" />

          {/* Chat */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(!isChatOpen)}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 border rounded-lg shadow-lg bg-background" align="end">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Admin Support
                </h3>
                <div className="bg-muted/20 p-2 rounded-md text-xs">
                  <p>Need help with admin tasks?</p>
                  <p className="text-xs text-muted-foreground mt-1">— Admin Bot</p>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Message..." className="flex-1 text-sm" />
                  <Button size="sm">Send</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Image
                  src="/images/davy.png"
                  alt="Profile"
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <span className="text-lg font-bold text-primary">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            {[
              { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
              { icon: Glasses, label: "Inventory", path: "/admin/inventory" },
              { icon: Users, label: "Clients", path: "/admin/clients" },
              { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
              { icon: Settings, label: "Settings", path: "/admin/settings" },
            ].map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => {
                  router.push(item.path);
                  setIsMobileNavOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
          <div className="p-2 border-t">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:border-r md:bg-background md:h-screen md:fixed">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Admin Iris</span>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
            { icon: Glasses, label: "Inventory", path: "/admin/inventory" },
            { icon: Users, label: "Clients", path: "/admin/clients" },
            { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
            { icon: Settings, label: "Settings", path: "/admin/settings" },
          ].map((item) => (
            <Button
              key={item.path}
              variant={pathname === item.path ? "secondary" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => router.push(item.path)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="p-2 border-t">
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-6 overflow-auto">
        {children}
      </main>

      {/* Mobile Overlay */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}
    </div>
  );
}