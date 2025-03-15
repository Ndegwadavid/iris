"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { SelectBranch } from "@/components";
import { registerClient } from "@/actions";

export default function ReceptionPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    reg_no: string;
    id: string;
  } | null>(null);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());

  const years = Array.from(
    { length: new Date().getFullYear() - 1899 },
    (_, i) => new Date().getFullYear() - i
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    if (date) {
      formData.append("dob", format(date, "yyyy-MM-dd"));
    }

    const response = await registerClient(formData);
    
    if (response.status === '201') {
        alert(response.message);
    } else {
      alert(response.message);
    }

    setIsSubmitting(false);
  };


  const navigateMonth = (direction: "prev" | "next") => {
    let newMonth = calendarMonth;
    let newYear = calendarYear;
    if (direction === "prev") {
      if (calendarMonth === 0) {
        newMonth = 11;
        newYear = calendarYear - 1;
      } else {
        newMonth = calendarMonth - 1;
      }
    } else {
      if (calendarMonth === 11) {
        newMonth = 0;
        newYear = calendarYear + 1;
      } else {
        newMonth = calendarMonth + 1;
      }
    }
    setCalendarMonth(newMonth);
    setCalendarYear(newYear);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 relative">
      {/* Toast Notification */}
      {successData && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-green-500 text-white rounded-lg shadow-lg p-3 flex items-center gap-3 max-w-md"
        >
          <CheckCircle className="h-5 w-5" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Client Registered!</p>
            <p className="text-xs">
              Reg No: {successData.reg_no} | ID: {successData.id}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-600 p-1"
          >
            Proceed
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-600 p-1"
            onClick={() => setSuccessData(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Client Registration
        </h1>
        <p className="text-muted-foreground">
          Register new clients at the reception desk
        </p>
      </div>

      <Card className="border-2 border-primary/10 shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle>New Client Registration</CardTitle>
          <CardDescription>
            Enter the client's personal information
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob" className="flex items-center">
                  <span>Date of Birth</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    (required)
                  </span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dob"
                      name="dob"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-2 hover:border-primary/50 transition-colors",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                      {date ? (
                        format(date, "dd MMMM yyyy")
                      ) : (
                        <span>Select date of birth</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 border-2 border-primary/10 shadow-md rounded-lg"
                    align="start"
                    sideOffset={5}
                  >
                    <div className="p-4 border-b border-border/60">
                      <h3 className="font-medium text-sm mb-2">
                        Select Date of Birth
                      </h3>
                      <div className="flex items-center justify-between mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigateMonth("prev")}
                          disabled={
                            calendarYear === 1900 && calendarMonth === 0
                          }
                          className="h-8 w-8 p-0"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex space-x-1">
                          <Select
                            value={calendarMonth.toString()}
                            onValueChange={(value) =>
                              setCalendarMonth(parseInt(value))
                            }
                          >
                            <SelectTrigger className="h-8 w-[110px] text-xs">
                              <SelectValue>{months[calendarMonth]}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {months.map((month, index) => (
                                <SelectItem
                                  key={index}
                                  value={index.toString()}
                                  className="text-xs"
                                >
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={calendarYear.toString()}
                            onValueChange={(value) =>
                              setCalendarYear(parseInt(value))
                            }
                          >
                            <SelectTrigger className="h-8 w-[80px] text-xs">
                              <SelectValue>{calendarYear}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {years.map((year) => (
                                <SelectItem
                                  key={year}
                                  value={year.toString()}
                                  className="text-xs"
                                >
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
                          disabled={
                            calendarYear === new Date().getFullYear() &&
                            calendarMonth === new Date().getMonth()
                          }
                          className="h-8 w-8 p-0"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="grid grid-cols-7 mb-2">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                          <div
                            key={i}
                            className="text-center text-xs font-medium text-muted-foreground w-10 h-8 flex items-center justify-center"
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(calendarYear, calendarMonth).map(
                          (day, i) => {
                            const isCurrentMonth =
                              day.getMonth() === calendarMonth;
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
                                  setTimeout(() => document.body.click(), 300);
                                }}
                                className={cn(
                                  "h-10 w-10 p-0 rounded-full font-normal",
                                  !isCurrentMonth &&
                                    "text-muted-foreground opacity-50",
                                  isToday &&
                                    !isSelected &&
                                    "border border-primary text-primary",
                                  isSelected &&
                                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                  isFuture && "text-muted-foreground opacity-30"
                                )}
                              >
                                {day.getDate()}
                              </Button>
                            );
                          }
                        )}
                      </div>
                    </div>
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
                <div
                  className="min-h-5 text-xs text-destructive"
                  aria-live="polite"
                >
                  {date === undefined && (
                    <span>Please select a date of birth</span>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone_number"
                  placeholder="+2547..."
                  required
                  maxLength={13}
                  className="font-mono"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="residence">Area of Residence</Label>
                <Input
                  id="residence"
                  name="residence"
                  placeholder="City, Area"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="servedBy">Served By</Label>
                <Input
                  id="servedBy"
                  name="servedBy"
                  placeholder="Staff name"
                  required
                />
              </div>
              {/* Select Branch Component */}
              <SelectBranch />

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="previousRx">Previous Rx (if any)</Label>
                <Textarea
                  id="previousRx"
                  name="previousRx"
                  placeholder="Enter previous prescription details if available"
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" required>
                  <SelectTrigger id="gender" className="w-full border-2">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                    <SelectItem value="O">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => window.location.reload()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !!successData}
              className="min-w-[150px]"
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : successData ? (
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
    </div>
  );
}

function getDaysInMonth(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days: Date[] = [];
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push(new Date(prevYear, prevMonth, daysInPrevMonth - i));
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(nextYear, nextMonth, i));
  }
  return days;
}

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
