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
import { CalendarIcon, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { generateClientId } from "@/lib/utils/generate-client-id"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReceptionPage() {
  const [date, setDate] = useState<Date | undefined>()
  const [phone, setPhone] = useState("+254") // Initialize with +254
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [calendarView, setCalendarView] = useState<"day" | "month" | "year">("day")
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth())
  const { toast } = useToast()
  
  // Generate years array for the year selector (1900 to current year)
  const years = Array.from(
    { length: new Date().getFullYear() - 1899 }, 
    (_, i) => new Date().getFullYear() - i
  )
  
  // Generate months array for the month selector
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      const dummyClientId = 1
      const clientRegistrationNumber = generateClientId(dummyClientId)

      setIsSubmitting(false)
      setIsSuccess(true)
      toast({
        title: "Client registered successfully",
        description: `Registration number: ${clientRegistrationNumber}`,
      })

      setTimeout(() => setIsSuccess(false), 3000)
    }, 1500)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Ensure it starts with +254 and only allows numbers after
    if (value.startsWith("+254")) {
      const numericPart = value.slice(4).replace(/[^0-9]/g, "")
      setPhone("+254" + numericPart)
    } else {
      setPhone("+254")
    }
  }
  
  // Helper to handle year/month navigation
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
                <Input id="firstName" placeholder="John" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" required />
              </div>
              
              {/* Custom Enhanced Calendar Selection */}
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
                        !date && "text-muted-foreground",
                        "aria-expanded:border-primary/70 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                      )}
                      aria-label="Select date of birth"
                    >
                      <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                      {date ? format(date, "dd MMMM yyyy") : <span>Select date of birth</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-auto p-0 border-2 border-primary/10 shadow-md rounded-lg" 
                    align="start"
                    sideOffset={5}
                  >
                    <div className="p-4 border-b border-border/60">
                      <h3 className="font-medium text-sm mb-2">Select Date of Birth</h3>
                      
                      {/* Custom Date Navigation */}
                      <div className="flex items-center justify-between mb-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigateMonth("prev")}
                          disabled={calendarYear === 1900 && calendarMonth === 0}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous month</span>
                        </Button>
                        
                        <div className="flex space-x-1">
                          {/* Month Selector */}
                          <Select
                            value={calendarMonth.toString()}
                            onValueChange={(value) => setCalendarMonth(parseInt(value))}
                          >
                            <SelectTrigger className="h-8 w-[110px] text-xs">
                              <SelectValue>{months[calendarMonth]}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {months.map((month, index) => (
                                <SelectItem key={index} value={index.toString()} className="text-xs">
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {/* Year Selector */}
                          <Select
                            value={calendarYear.toString()}
                            onValueChange={(value) => setCalendarYear(parseInt(value))}
                          >
                            <SelectTrigger className="h-8 w-[80px] text-xs">
                              <SelectValue>{calendarYear}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {years.map((year) => (
                                <SelectItem key={year} value={year.toString()} className="text-xs">
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigateMonth("next")}
                          disabled={calendarYear === new Date().getFullYear() && calendarMonth === new Date().getMonth()}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next month</span>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Calendar Days */}
                    <div className="p-3">
                      {/* Days of week header - fixed width for better alignment */}
                      <div className="grid grid-cols-7 mb-2">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                          <div key={i} className="text-center text-xs font-medium text-muted-foreground w-10 h-8 flex items-center justify-center">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Calendar grid with better alignment */}
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(calendarYear, calendarMonth).map((day, i) => {
                          const isCurrentMonth = day.getMonth() === calendarMonth;
                          const isToday = isSameDay(day, new Date());
                          const isSelected = date && isSameDay(day, date);
                          const isFuture = day > new Date();
                          
                          return (
                            <Button
                              key={i}
                              variant="ghost"
                              size="sm"
                              disabled={isFuture}
                              onClick={() => {
                                setDate(day);
                                // Auto-close popover after selection
                                setTimeout(() => document.body.click(), 300);
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
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Footer with quick actions */}
                    <div className="p-3 border-t border-border/60 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setDate(undefined)}
                        className="text-xs"
                      >
                        Clear
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          const today = new Date();
                          setDate(today);
                          setCalendarMonth(today.getMonth());
                          setCalendarYear(today.getFullYear());
                        }}
                        className="text-xs"
                      >
                        Today
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                {/* Error message space for validation */}
                <div className="min-h-5 text-xs text-destructive" aria-live="polite">
                  {date === undefined && <span className="hidden">Please select a date of birth</span>}
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+2547..."
                  required
                  maxLength={13} // +254 + 9 digits
                  className="font-mono" // Monospace for better number alignment
                />
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
                <Textarea id="previousRx" placeholder="Enter previous prescription details if available" rows={4} />
              </div>
              {/* Enhancement: Gender Field */}
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  className="w-full border-2 rounded-md p-2 bg-background text-foreground focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {/* Enhancement: Emergency Contact */}
              <div className="grid gap-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input id="emergencyContact" placeholder="+254..." />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
            <Button variant="outline" type="button" onClick={() => window.location.reload()}>
              Cancel
            </Button>
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

// Helper functions for the calendar
function getDaysInMonth(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  
  // Create array for all days to display including padding from previous/next months
  const days: Date[] = []
  
  // Add days from previous month
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
  
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push(new Date(prevYear, prevMonth, daysInPrevMonth - i))
  }
  
  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }
  
  // Add days from next month (to complete 6 rows of 7 days)
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  
  const remainingDays = 42 - days.length // 6 rows of 7 days
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