"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Edit, Eye, FileText, User } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Client, fetchClientById } from "@/lib/clients"

export default function ClientPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadClient = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "No client ID provided",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const data = await fetchClientById(id)
      if (data) {
        setClient(data)
      } else {
        toast({
          title: "Error",
          description: "Client not found",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }
    loadClient()
  }, [id, toast])

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading client...</div>
  }

  if (!client) {
    return <div className="text-center text-muted-foreground">Client not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{`${client.first_name} ${client.last_name}`}</h1>
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
                <dd className="text-sm">{client.reg_no}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
                <dd className="text-sm">{client.date_of_birth}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd className="text-sm">{client.phone_number}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">{client.email || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Visit</dt>
                <dd className="text-sm">
                  {client.last_examination_date
                    ? new Date(client.last_examination_date).toLocaleDateString()
                    : "N/A"}
                </dd>
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
      <Toaster />
    </div>
  )
}