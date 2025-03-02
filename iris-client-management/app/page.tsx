import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Users, Clock, Calendar, Activity } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/format"

// Sample dashboard data
const dashboardData = {
  totalClients: 245,
  clientGrowth: 12,
  pendingExams: 12,
  examGrowth: 2,
  todayAppointments: {
    total: 8,
    completed: 3,
    pending: 5,
  },
  monthlyRevenue: 1223400, // In KES
  revenueGrowth: 18.2,
  recentClients: [
    { id: 1, name: "John Doe", registeredTime: "2 hours ago" },
    { id: 2, name: "Jane Smith", registeredTime: "3 hours ago" },
    { id: 3, name: "Michael Brown", registeredTime: "4 hours ago" },
    { id: 4, name: "Sarah Wilson", registeredTime: "5 hours ago" },
    { id: 5, name: "Robert Davis", registeredTime: "6 hours ago" },
  ],
  upcomingExams: [
    { id: 1, name: "Jane Smith", time: "10:30 AM", doctor: "Dr. Johnson" },
    { id: 2, name: "Michael Brown", time: "11:00 AM", doctor: "Dr. Smith" },
    { id: 3, name: "Sarah Wilson", time: "11:30 AM", doctor: "Dr. Johnson" },
    { id: 4, name: "Robert Davis", time: "12:00 PM", doctor: "Dr. Smith" },
    { id: 5, name: "Emily Johnson", time: "2:00 PM", doctor: "Dr. Johnson" },
  ],
}

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline">Export</Button>
          <Link href="/reception">
            <Button>New Client</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalClients}</div>
            <p className="text-xs text-muted-foreground">+{dashboardData.clientGrowth}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Examinations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingExams}</div>
            <p className="text-xs text-muted-foreground">+{dashboardData.examGrowth} since yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.todayAppointments.total}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.todayAppointments.completed} completed, {dashboardData.todayAppointments.pending} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">+{dashboardData.revenueGrowth}% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
            <CardDescription>Latest client registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentClients.map((client) => (
                <div key={client.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">Registered {client.registeredTime}</p>
                  </div>
                  <Link href={`/clients/client?id=${client.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Examinations</CardTitle>
            <CardDescription>Scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.upcomingExams.map((exam) => (
                <div key={exam.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{exam.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {exam.time} - {exam.doctor}
                    </p>
                  </div>
                  <Link href="/examination">
                    <Button variant="ghost" size="sm">
                      Start
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

