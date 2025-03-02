"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Search, Eye, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Dummy data for examinations
const pendingExaminations = [
  { id: 1, name: "John Doe", time: "10:30 AM", doctor: "Dr. Smith" },
  { id: 2, name: "Jane Smith", time: "11:15 AM", doctor: "Dr. Johnson" },
  { id: 3, name: "Michael Brown", time: "1:45 PM", doctor: "Dr. Williams" },
]

const completedExaminations = [
  { id: 4, name: "Sarah Wilson", time: "9:00 AM", doctor: "Dr. Smith" },
  { id: 5, name: "Robert Davis", time: "9:45 AM", doctor: "Dr. Johnson" },
]

export default function ExaminationPage() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would search the database
    toast({
      title: "Search results",
      description: `Found 3 clients matching "${searchQuery}"`,
    })
  }

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Examination record saved",
      description: "The prescription has been saved successfully",
    })
    setSelectedClient(null)
    setActiveTab("completed")
  }

  const startExamination = (client: any) => {
    setSelectedClient(client)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Eye Examination</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Search</CardTitle>
              <CardDescription>Find a client to examine</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Examinations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
                <div className="px-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="pending" className="flex-1">
                      Pending
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex-1">
                      Completed
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="pending" className="pt-2">
                  <div className="space-y-2 px-4 pb-4">
                    {pendingExaminations.map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between p-2 rounded-md border">
                        <div>
                          <p className="font-medium">{exam.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {exam.time} - {exam.doctor}
                          </p>
                        </div>
                        <Button size="sm" onClick={() => startExamination(exam)}>
                          Start
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="completed" className="pt-2">
                  <div className="space-y-2 px-4 pb-4">
                    {completedExaminations.map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between p-2 rounded-md border">
                        <div>
                          <p className="font-medium">{exam.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {exam.time} - {exam.doctor}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          {selectedClient ? (
            <Card>
              <CardHeader className="bg-primary/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Prescription for {selectedClient.name}</CardTitle>
                    <CardDescription>
                      {selectedClient.time} - {selectedClient.doctor}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    <span>In Progress</span>
                  </div>
                </div>
              </CardHeader>
              <form onSubmit={handleSaveRecord}>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Prescription Details</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4 border-r pr-4">
                          <div className="text-center font-medium text-primary">Right Eye (R)</div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="r-sph">SPH</Label>
                              <Input id="r-sph" placeholder="-2.00" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="r-cyl">CYL</Label>
                              <Input id="r-cyl" placeholder="-0.50" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="r-axis">AXIS</Label>
                              <Input id="r-axis" placeholder="180" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="r-add">ADD</Label>
                              <Input id="r-add" placeholder="+2.00" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="r-va">V/A</Label>
                              <Input id="r-va" placeholder="6/6" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="r-ipd">IPD</Label>
                              <Input id="r-ipd" placeholder="31" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="text-center font-medium text-primary">Left Eye (L)</div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="l-sph">SPH</Label>
                              <Input id="l-sph" placeholder="-2.25" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="l-cyl">CYL</Label>
                              <Input id="l-cyl" placeholder="-0.75" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="l-axis">AXIS</Label>
                              <Input id="l-axis" placeholder="175" />
                            </div>
                            <div className="grid gap-2"></div>
                            <div className="grid gap-2">
                              <Label htmlFor="l-add">ADD</Label>
                              <Input id="l-add" placeholder="+2.00" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="l-va">V/A</Label>
                              <Input id="l-va" placeholder="6/6" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="l-ipd">IPD</Label>
                              <Input id="l-ipd" placeholder="31" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="clinical-history">Clinical History</Label>
                      <Textarea
                        id="clinical-history"
                        placeholder="Enter any relevant clinical history or notes"
                        rows={4}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="examined-by">Examined By</Label>
                      <Input id="examined-by" placeholder="Dr. Name" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
                  <Button variant="outline" type="button" onClick={() => setSelectedClient(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save Record
                  </Button>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg p-12">
              <div className="text-center">
                <Eye className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No Active Examination</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Search for a client or select from the pending examinations list to start.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  )
}

