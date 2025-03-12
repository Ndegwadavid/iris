"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReceptionPage() {
  const [date, setDate] = useState<Date | undefined>()
  const [lastExamDate, setLastExamDate] = useState<Date | undefined>()
  const [phone, setPhone] = useState("+254")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth())
  const { toast } = useToast()
  const router = useRouter()

  const API_URL = "http://127.0.0.1:8000/api/v001/clients/register/"

  const years = Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i)
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      dob: date ? format(date, "yyyy-MM-dd") : "",
      phone_number: phone,
      email: formData.get("email") as string,
      location: formData.get("residence") as string,
      registered_by: formData.get("servedBy") as string,
      gender: formData.get("gender") as string,
      previous_prescription: formData.get("previousRx") as string || "",
      last_examination_date: lastExamDate ? format(lastExamDate, "yyyy-MM-dd") : null,
    }

    if (!data.dob || !data.gender) {
      setIsSubmitting(false)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Date of Birth and Gender are required.",
      })
      return
    }

    try {
      const response = await fetch(API_URL, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data) //includeing the data collected to avoid errosd.
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || JSON.stringify(errorData) || "Failed to register client")
      }

      const result = await response.json()
      setIsSubmitting(false)
      setIsSuccess(true)
      toast({
        title: "Client registered successfully",
        description: `Client ID: ${result.id || "N/A"}`, // Fallback to "N/A" if id is missing
      })

      form.reset()
      setDate(undefined)
      setLastExamDate(undefined)
      setPhone("+254")
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      setIsSubmitting(false)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.startsWith("+254")) {
      const numericPart = value.slice(4).replace(/[^0-9]/g, "")
      setPhone("+254" + numericPart)
    } else {
      setPhone("+254")
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    let newMonth = calendarMonth
    let newYear = calendarYear
    if (direction === "prev") {
      if (calendarMonth === 0) {
        newMonth = 11
        newYear = calendarYear - 1
      } else {
        newMonth = calendarMonth - 1
      }
    } else {
      if (calendarMonth === 11) {
        newMonth = 0
        newYear = calendarYear + 1
      } else {
        newMonth = calendarMonth + 1
      }
    }
    setCalendarMonth(newMonth)
    setCalendarYear(newYear)
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Client Registration</h1>
        <p className="text-muted-foreground">Register new clients at the reception desk</p>
      </div>

      <Card className="border-2 border-primary/10 shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle>New Client Registration</CardTitle>
          <CardDescription>Enter the client's personal information</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" placeholder="John" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" placeholder="Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob" className="flex items-center">
                  <span>Date of Birth</span>
                  <span className="text-sm text-muted-foreground ml-1">(required)</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dob"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-2 hover:border-primary/50 transition-colors",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                      {date ? format(date, "dd MMMM yyyy") : <span>Select date of birth</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-2 border-primary/10 shadow-md rounded-lg" align="start" sideOffset={5}>
                    <div className="p-4 border-b border-border/60">
                      <h3 className="font-medium text-sm mb-2">Select Date of Birth</h3>
                      <div className="flex items-center justify-between mb-2">
                        <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")} disabled={calendarYear === 1900 && calendarMonth === 0} className="h-8 w-8 p-0">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex space-x-1">
                          <Select value={calendarMonth.toString()} onValueChange={(value) => setCalendarMonth(parseInt(value))}>
                            <SelectTrigger className="h-8 w-[110px] text-xs">
                              <SelectValue>{months[calendarMonth]}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {months.map((month, index) => (
                                <SelectItem key={index} value={index.toString()} className="text-xs">{month}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={calendarYear.toString()} onValueChange={(value) => setCalendarYear(parseInt(value))}>
                            <SelectTrigger className="h-8 w-[80px] text-xs">
                              <SelectValue>{calendarYear}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {years.map((year) => (
                                <SelectItem key={year} value={year.toString()} className="text-xs">{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")} disabled={calendarYear === new Date().getFullYear() && calendarMonth === new Date().getMonth()} className="h-8 w-8 p-0">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="grid grid-cols-7 mb-2">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                          <div key={i} className="text-center text-xs font-medium text-muted-foreground w-10 h-8 flex items-center justify-center">{day}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(calendarYear, calendarMonth).map((day, i) => {
                          const isCurrentMonth = day.getMonth() === calendarMonth
                          const isToday = isSameDay(day, new Date())
                          const isSelected = date && isSameDay(day, date)
                          const isFuture = day > new Date()
                          return (
                            <Button
                              key={i}
                              variant="ghost"
                              size="sm"
                              disabled={isFuture}
                              onClick={() => {
                                setDate(day)
                                setTimeout(() => document.body.click(), 300)
                              }}
                              className={cn(
                                "h-10 w-10 p-0 rounded-full font-normal",
                                !isCurrentMonth && "text-muted-foreground opacity-50",
                                isToday && !isSelected && "border border-primary text-primary",
                                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                isFuture && "text-muted-foreground opacity-30"
                              )}
                            >
                              {day.getDate()}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="p-3 border-t border-border/60 flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => setDate(undefined)} className="text-xs">Clear</Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        const today = new Date()
                        setDate(today)
                        setCalendarMonth(today.getMonth())
                        setCalendarYear(today.getFullYear())
                      }} className="text-xs">Today</Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="min-h-5 text-xs text-destructive" aria-live="polite">
                  {date === undefined && <span>Please select a date of birth</span>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={phone} onChange={handlePhoneChange} placeholder="+2547..." required maxLength={13} className="font-mono" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="residence">Area of Residence</Label>
                <Input id="residence" name="residence" placeholder="City, Area" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="servedBy">Served By</Label>
                <Input id="servedBy" name="servedBy" placeholder="Staff name" required />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="previousRx">Previous Rx (if any)</Label>
                <Textarea id="previousRx" name="previousRx" placeholder="Enter previous prescription details if available" rows={4} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" required>
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                    <SelectItem value="O">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid birthgap-2">
                <Label htmlFor="lastExamDate">Last Examination Date (if any)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="lastExamDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-2 hover:border-primary/50 transition-colors",
                        !lastExamDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                      {lastExamDate ? format(lastExamDate, "dd MMMM yyyy") : <span>Select last exam date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-2 border-primary/10 shadow-md rounded-lg" align="start" sideOffset={5}>
                    <div className="p-4 border-b border-border/60">
                      <h3 className="font-medium text-sm mb-2">Select Last Examination Date</h3>
                      <div className="flex items-center justify-between mb-2">
                        <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")} disabled={calendarYear === 1900 && calendarMonth === 0} className="h-8 w-8 p-0">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex space-x-1">
                          <Select value={calendarMonth.toString()} onValueChange={(value) => setCalendarMonth(parseInt(value))}>
                            <SelectTrigger className="h-8 w-[110px] text-xs">
                              <SelectValue>{months[calendarMonth]}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {months.map((month, index) => (
                                <SelectItem key={index} value={index.toString()} className="text-xs">{month}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={calendarYear.toString()} onValueChange={(value) => setCalendarYear(parseInt(value))}>
                            <SelectTrigger className="h-8 w-[80px] text-xs">
                              <SelectValue>{calendarYear}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {years.map((year) => (
                                <SelectItem key={year} value={year.toString()} className="text-xs">{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")} disabled={calendarYear === new Date().getFullYear() && calendarMonth === new Date().getMonth()} className="h-8 w-8 p-0">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="grid grid-cols-7 mb-2">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                          <div key={i} className="text-center text-xs font-medium text-muted-foreground w-10 h-8 flex items-center justify-center">{day}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(calendarYear, calendarMonth).map((day, i) => {
                          const isCurrentMonth = day.getMonth() === calendarMonth
                          const isToday = isSameDay(day, new Date())
                          const isSelected = lastExamDate && isSameDay(day, lastExamDate)
                          const isFuture = day > new Date()
                          return (
                            <Button
                              key={i}
                              variant="ghost"
                              size="sm"
                              disabled={isFuture}
                              onClick={() => {
                                setLastExamDate(day)
                                setTimeout(() => document.body.click(), 300)
                              }}
                              className={cn(
                                "h-10 w-10 p-0 rounded-full font-normal",
                                !isCurrentMonth && "text-muted-foreground opacity-50",
                                isToday && !isSelected && "border border-primary text-primary",
                                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                isFuture && "text-muted-foreground opacity-30"
                              )}
                            >
                              {day.getDate()}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="p-3 border-t border-border/60 flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => setLastExamDate(undefined)} className="text-xs">Clear</Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        const today = new Date()
                        setLastExamDate(today)
                        setCalendarMonth(today.getMonth())
                        setCalendarYear(today.getFullYear())
                      }} className="text-xs">Today</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
            <Button variant="outline" type="button" onClick={() => window.location.reload()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || isSuccess} className="min-w-[150px]">
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

function getDaysInMonth(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const days: Date[] = []
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push(new Date(prevYear, prevMonth, daysInPrevMonth - i))
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(nextYear, nextMonth, i))
  }
  return days
}

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}