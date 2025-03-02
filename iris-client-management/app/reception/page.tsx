"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { generateClientId } from "@/lib/utils/generate-client-id"

export default function ReceptionPage() {
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Generate client ID (this would normally come from the database)
      const dummyClientId = 1
      const clientRegistrationNumber = generateClientId(dummyClientId)

      setIsSubmitting(false)
      setIsSuccess(true)
      toast({
        title: "Client registered successfully",
        description: `Registration number: ${clientRegistrationNumber}`,
      })

      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Client Registration</h1>
        <p className="text-muted-foreground">Register new clients at the reception desk</p>
      </div>

      <Card className="border-2 border-primary/10">
        <CardHeader className="bg-primary/5">
          <CardTitle>New Client Registration</CardTitle>
          <CardDescription>Enter the client's personal information</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+254..." required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="residence">Area of Residence</Label>
                <Input id="residence" placeholder="City, Area" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="servedBy">Served By</Label>
                <Input id="servedBy" placeholder="Staff name" required />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="previousRx">Previous Rx (if any)</Label>
                <Textarea id="previousRx" placeholder="Enter previous prescription details if available" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
            <Button variant="outline">Cancel</Button>
            <Button type="submit" disabled={isSubmitting || isSuccess}>
              {isSubmitting ? (
                <>Processing...</>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Registered
                </>
              ) : (
                "Register Client"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  )
}

