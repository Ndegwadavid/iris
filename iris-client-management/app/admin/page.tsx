"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  BarChart3,
  Download,
  Eye,
  FileText,
  ShoppingBag,
  Clock,
  Users,
  Plus,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { SAMPLE_STAFF } from "@/lib/constants"
import { formatCurrency } from "@/lib/utils/format"

// Sample admin dashboard data
const dashboardData = {
  totalRevenue: 4523189,
  revenueGrowth: 20.1,
  totalClients: 573,
  clientGrowth: 18.2,
  totalSales: 249,
  salesGrowth: 12.5,
  pendingOrders: 15,
  ordersGrowth: 5.3,
}

export default function AdminPage() {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [dateRange, setDateRange] = useState("month")

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submission
    setIsAddStaffOpen(false)
  }

  return (
    <div className="h-screen flex dark:bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your optical business</p>
            </div>
            <div className="flex items-center gap-4">
              <Select defaultValue={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">+{dashboardData.revenueGrowth}% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{dashboardData.totalClients}</div>
                <p className="text-xs text-muted-foreground">+{dashboardData.clientGrowth}% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{dashboardData.totalSales}</div>
                <p className="text-xs text-muted-foreground">+{dashboardData.salesGrowth}% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{dashboardData.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">+{dashboardData.ordersGrowth}% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="staff" className="space-y-4">
            <TabsList>
              <TabsTrigger value="staff">Staff Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="staff" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Staff Members</CardTitle>
                      <CardDescription>Manage employee accounts and permissions</CardDescription>
                    </div>
                    <Popover open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
                      <PopoverTrigger asChild>
                        <Button onClick={() => setIsAddStaffOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Staff
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4 border-2 border-muted rounded-lg shadow-lg bg-background">
                        <form onSubmit={handleAddStaffSubmit} className="space-y-4">
                          <h3 className="font-semibold text-lg">Add New Staff</h3>
                          <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="John" required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Doe" required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="optometrist">Optometrist</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="storekeeper">Store Keeper</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="engineering">Engineering</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsAddStaffOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Add Staff</Button>
                          </div>
                        </form>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 border-b bg-muted/50 p-3 text-sm font-medium">
                      <div>Name</div>
                      <div>Email</div>
                      <div>Role</div>
                      <div>Status</div>
                    </div>
                    {SAMPLE_STAFF.map((staff) => (
                      <div key={staff.id} className="grid grid-cols-4 border-b p-3 text-sm last:border-0">
                        <div>{staff.name}</div>
                        <div>{staff.email}</div>
                        <div className="capitalize">{staff.role}</div>
                        <div>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              staff.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {staff.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Business Analytics</CardTitle>
                  <CardDescription>View detailed performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Detailed analytics will be displayed here when connected to the backend.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    System settings will be available here when connected to the backend.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Track recent staff actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { user: "John Doe", action: "Added a new client", time: "10 minutes ago" },
                      { user: "Jane Smith", action: "Processed a sale", time: "1 hour ago" },
                      { user: "Mike Brown", action: "Updated inventory", time: "2 hours ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                        <div>
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-sm text-muted-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground/70 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}