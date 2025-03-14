"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Search, Eye, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExaminationPage() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [pendingExams, setPendingExams] = useState<any[]>([])
  const [completedExams, setCompletedExams] = useState<any[]>([])
  const [optometrists, setOptometrists] = useState<any[]>([])
  const [formData, setFormData] = useState({
    right_sph: "",
    right_cyl: "",
    right_axis: "",
    right_add: "",
    right_va: "N/A",
    right_ipd: "",
    left_sph: "",
    left_cyl: "",
    left_axis: "",
    left_add: "",
    left_va: "N/A",
    left_ipd: "",
    clinical_history: "",
    examined_by: "", // Add optometrist ID
  })
  const { toast } = useToast()
  const router = useRouter()

  const PENDING_EXAMS_URL = "http://127.0.0.1:8000/api/v001/clients/examinations/pending/"
  const COMPLETED_EXAMS_URL = "http://127.0.0.1:8000/api/v001/clients/examinations/completed/"
  const EXAMINE_URL = "http://127.0.0.1:8000/api/v001/clients/examination/"
  const OPTOMETRISTS_URL = "http://127.0.0.1:8000/api/v001/auth/staff/optometrists/" // New endpoint

  useEffect(() => {
    fetchPendingExaminations()
    fetchCompletedExaminations()
    fetchOptometrists()
  }, [])

  const fetchPendingExaminations = async () => {
    try {
      const response = await fetch(PENDING_EXAMS_URL, { method: "GET", credentials: "include" })
      if (!response.ok) throw new Error("Unauthorized or fetch failed")
      const data = await response.json()
      setPendingExams(data.data || [])
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch pending exams" })
      router.push("/")
    }
  }

  const fetchCompletedExaminations = async () => {
    try {
      const response = await fetch(COMPLETED_EXAMS_URL, { method: "GET", credentials: "include" })
      if (!response.ok) throw new Error("Unauthorized or fetch failed")
      const data = await response.json()
      setCompletedExams(data.data || [])
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch completed exams" })
    }
  }

  const fetchOptometrists = async () => {
    try {
      const response = await fetch(OPTOMETRISTS_URL, { method: "GET", credentials: "include" })
      if (!response.ok) throw new Error("Unauthorized or fetch failed")
      const data = await response.json()
      setOptometrists(data || [])
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch optometrists" })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleOptometristChange = (value: string) => {
    setFormData((prev) => ({ ...prev, examined_by: value }))
  }

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient) return

    try {
      const response = await fetch(`${EXAMINE_URL}${selectedClient.id}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save examination")
      const result = await response.json()

      const completedExam = { ...selectedClient, ...formData, state: "Completed" }
      setPendingExams(pendingExams.filter((exam) => exam.id !== selectedClient.id))
      setCompletedExams([completedExam, ...completedExams])
      setSelectedClient(null)
      setActiveTab("completed")
      setFormData({
        right_sph: "", right_cyl: "", right_axis: "", right_add: "", right_va: "N/A", right_ipd: "",
        left_sph: "", left_cyl: "", left_axis: "", left_add: "", left_va: "N/A", left_ipd: "",
        clinical_history: "", examined_by: ""
      })
      toast({ title: "Success", description: `Prescription for ${selectedClient.client_name} saved` })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong" })
    }
  }

  const startExamination = (exam: any) => {
    setSelectedClient(exam)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: "Search", description: `Searching for "${searchQuery}" (not implemented)` })
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Eye Examination</h1>

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
                    <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
                    <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="pending" className="pt-2">
                  <div className="space-y-2 px-4 pb-4">
                    {pendingExams.map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between p-2 rounded-md border">
                        <div>
                          <p className="font-medium">{exam.client_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(exam.created_at).toLocaleTimeString()} - {exam.examined_by_name || "Unassigned"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-amber-600 bg-amber-100 px-2 py-1 rounded-full flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Pending
                          </span>
                          <Button size="sm" onClick={() => startExamination(exam)}>Start</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="completed" className="pt-2">
                  <div className="space-y-2 px-4 pb-4">
                    {completedExams.map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between p-2 rounded-md border">
                        <div>
                          <p className="font-medium">{exam.client_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(exam.updated_at || exam.created_at).toLocaleTimeString()} - {exam.examined_by_name || "Unassigned"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Completed
                          </span>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
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
                    <CardTitle>Prescription for {selectedClient.client_name}</CardTitle>
                    <CardDescription>
                      {new Date(selectedClient.created_at).toLocaleTimeString()} - {selectedClient.examined_by_name || "Unassigned"}
                    </CardDescription>
                  </div>
                  <span className="text-sm text-amber-600 bg-amber-100 px-2 py-1 rounded-full flex items-center gap-1">
                    <Clock className="h-3 w-3" /> In Progress
                  </span>
                </div>
              </CardHeader>
              <form onSubmit={handleSaveRecord}>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Prescription Details</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4 border-r pr-4">
                        <div className="text-center font-medium text-primary">Right Eye (R)</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="right_sph">SPH</Label>
                            <Input id="right_sph" placeholder="-2.00" value={formData.right_sph} onChange={handleInputChange} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="right_cyl">CYL</Label>
                            <Input id="right_cyl" placeholder="-0.50" value={formData.right_cyl} onChange={handleInputChange} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="right_axis">AXIS</Label>
                            <Input id="right_axis" placeholder="180" value={formData.right_axis} onChange={handleInputChange} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="right_add">ADD</Label>
                            <Input id="right_add" placeholder="+2.00" value={formData.right_add} onChange={handleInputChange} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="right_va">V/A</Label>
                            <Input id="right_va" placeholder="6/6" value={formData.right_va} onChange={handleInputChange} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="right_ipd">IPD</Label>
                            <Input id="right_ipd" placeholder="31" value={formData.right_ipd} onChange={handleInputChange} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="text-center font-medium text-primary">Left Eye (L)</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="left_sph">SPH</Label>
                            <Input id="left_sph" placeholder="-2.25" value={formData.left_sph} onChange={handleInputChange} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="left_cyl">CYL</Label>
                            <Input id="left_cyl" placeholder="-0.75" value={formData.left_cyl} onChange={handleInputChange} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="left_axis">AXIS</Label>
                            <Input id="left_axis" placeholder="175" value={formData.left_axis} onChange={handleInputChange} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="left_add">ADD</Label>
                            <Input id="left_add" placeholder="+2.00" value={formData.left_add} onChange={handleInputChange} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="left_va">V/A</Label>
                            <Input id="left_va" placeholder="6/6" value={formData.left_va} onChange={handleInputChange} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="left_ipd">IPD</Label>
                            <Input id="left_ipd" placeholder="31" value={formData.left_ipd} onChange={handleInputChange} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="clinical_history">Clinical History</Label>
                    <Textarea
                      id="clinical_history"
                      placeholder="Enter any relevant clinical history or notes"
                      rows={4}
                      value={formData.clinical_history}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="examined_by">Examined By</Label>
                    <Select onValueChange={handleOptometristChange} value={formData.examined_by}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an optometrist" />
                      </SelectTrigger>
                      <SelectContent>
                        {optometrists.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.first_name} {opt.last_name} ({opt.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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