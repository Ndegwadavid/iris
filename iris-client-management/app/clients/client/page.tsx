"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Edit, Eye, FileText, User } from "lucide-react"
import Link from "next/link"
import { SAMPLE_CLIENTS } from "@/lib/constants"

export default function ClientPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  // Find client by ID
  const client = SAMPLE_CLIENTS.find((c) => c.id === Number(id)) || SAMPLE_CLIENTS[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Client
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Registration Number</dt>
                <dd className="text-sm">{client.regNo}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
                <dd className="text-sm">{client.dob}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd className="text-sm">{client.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">{client.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                <dd className="text-sm">{client.address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Visit</dt>
                <dd className="text-sm">{client.lastVisit}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="prescriptions">
            <TabsList className="w-full">
              <TabsTrigger value="prescriptions" className="flex-1">
                <Eye className="mr-2 h-4 w-4" />
                Prescriptions
              </TabsTrigger>
              <TabsTrigger value="examinations" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Examination History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="prescriptions" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Prescription History</CardTitle>
                  <CardDescription>View all prescriptions for this client</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">No prescriptions found.</div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="examinations" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Examination History</CardTitle>
                  <CardDescription>View all examinations for this client</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">No examination history found.</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

