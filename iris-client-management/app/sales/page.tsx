"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ArrowRight, CheckCircle, CreditCard, Loader2, ShoppingBag, ShoppingCart } from "lucide-react"
import { FRAME_OPTIONS, LENS_OPTIONS } from "@/lib/constants"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type Examination = {
  id: string
  client_name: string
  examination_date: string
  state: string
  booked_for_sales: boolean
}

type SalePayload = {
  examination: string
  frame_brand: string
  frame_model: string
  frame_color: string
  frame_quantity: number
  frame_price: number
  lens_brand: string
  lens_type: string
  lens_material: string
  lens_coating: string
  lens_quantity: number
  lens_price: number
  fitting_instructions: string
  delivery_date: string
  booked_by: string
  advance_payment_method: string
  advance_paid: number
  mpesa_transaction_code?: string
}

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState("new-sale")
  const [examinations, setExaminations] = useState<Examination[]>([])
  const [selectedExam, setSelectedExam] = useState<string>("")
  const [saleDetails, setSaleDetails] = useState<SalePayload>({
    examination: "",
    frame_brand: "",
    frame_model: "",
    frame_color: "",
    frame_quantity: 1,
    frame_price: 0,
    lens_brand: "",
    lens_type: "",
    lens_material: "",
    lens_coating: "",
    lens_quantity: 1,
    lens_price: 0,
    fitting_instructions: "",
    delivery_date: "",
    booked_by: "",
    advance_payment_method: "Cash",
    advance_paid: 0,
    mpesa_transaction_code: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [recentSales, setRecentSales] = useState<any[]>([])
  const { toast } = useToast()

  const API_URL = "http://127.0.0.1:8000/api/v001/clients/sales/"
  const EXAMINATIONS_URL = "http://127.0.0.1:8000/api/v001/clients/examinations/"

  // Fetch all examinations and filter for completed ones 
  useEffect(() => {
    const fetchExaminations = async () => {
      try {
        const response = await fetch(EXAMINATIONS_URL, {
          method: "GET",
          credentials: "include",
        })
        if (!response.ok) throw new Error("Failed to fetch examinations")
        const data = await response.json()
        const completedExams = data.d.filter(
          (exam: Examination) => exam.state === "Completed" && exam.booked_for_sales
        )
        setExaminations(completedExams)
        console.log("Fetched completed examinations:", completedExams)
      } catch (error) {
        console.error("Error fetching examinations:", error)
        toast({ title: "Error", description: "Failed to load examinations", variant: "destructive" })
      }
    }
    fetchExaminations()
  }, [toast])

  // Fetch recent sales
  useEffect(() => {
    const fetchRecentSales = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
        })
        if (!response.ok) throw new Error("Failed to fetch sales")
        const data = await response.json()
        setRecentSales(data)
        console.log("Fetched recent sales:", data)
      } catch (error) {
        console.error("Error fetching sales:", error)
      }
    }
    if (activeTab === "recent-sales") fetchRecentSales()
  }, [activeTab])

  // Handle input changes
  const handleInputChange = (field: keyof SalePayload, value: string | number) => {
    setSaleDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Calculate totals (for UI display only)
  const calculateTotals = () => {
    const frameTotal = saleDetails.frame_price * saleDetails.frame_quantity
    const lensTotal = saleDetails.lens_price * saleDetails.lens_quantity
    const total = frameTotal + lensTotal
    const advance = saleDetails.advance_paid
    const balance = total - advance
    return { total, advance, balance }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedExam) {
      toast({ title: "Error", description: "Please select an examination", variant: "destructive" })
      return
    }

    setIsProcessing(true)
    const payload = {
      examination: selectedExam,
      frame_brand: saleDetails.frame_brand,
      frame_model: saleDetails.frame_model,
      frame_color: saleDetails.frame_color,
      frame_quantity: Number(saleDetails.frame_quantity),
      frame_price: Number(saleDetails.frame_price),
      lens_brand: saleDetails.lens_brand,
      lens_type: saleDetails.lens_type,
      lens_material: saleDetails.lens_material,
      lens_coating: saleDetails.lens_coating,
      lens_quantity: Number(saleDetails.lens_quantity),
      lens_price: Number(saleDetails.lens_price),
      fitting_instructions: saleDetails.fitting_instructions,
      delivery_date: saleDetails.delivery_date,
      booked_by: saleDetails.booked_by,
      advance_payment_method: saleDetails.advance_payment_method,
      advance_paid: Number(saleDetails.advance_paid),
      ...(saleDetails.advance_payment_method === "Mpesa" && {
        mpesa_transaction_code: saleDetails.mpesa_transaction_code,
      }),
    }

    console.log("Submitting payload:", payload)

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create sale")
      }

      const result = await response.json()
      setIsProcessing(false)
      toast({ title: "Success", description: result.message || "Sale recorded successfully" })

      // Reset form
      setSaleDetails({
        examination: "",
        frame_brand: "",
        frame_model: "",
        frame_color: "",
        frame_quantity: 1,
        frame_price: 0,
        lens_brand: "",
        lens_type: "",
        lens_material: "",
        lens_coating: "",
        lens_quantity: 1,
        lens_price: 0,
        fitting_instructions: "",
        delivery_date: "",
        booked_by: "",
        advance_payment_method: "Cash",
        advance_paid: 0,
        mpesa_transaction_code: "",
      })
      setSelectedExam("")
      setActiveTab("recent-sales")
    } catch (error) {
      setIsProcessing(false)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process sale",
        variant: "destructive",
      })
    }
  }

  const totals = calculateTotals()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
          <p className="text-muted-foreground">Process sales for completed client examinations</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-sale">
            <ShoppingCart className="mr-2 h-4 w-4" /> New Sale
          </TabsTrigger>
          <TabsTrigger value="recent-sales">
            <ShoppingBag className="mr-2 h-4 w-4" /> Recent Sales
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new-sale" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Examination</CardTitle>
                  <CardDescription>Select a completed examination</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedExam} onValueChange={setSelectedExam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select examination">
                        {selectedExam
                          ? examinations.find((e) => e.id === selectedExam)?.client_name
                          : "Select examination"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {examinations.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">No completed examinations available</div>
                      ) : (
                        examinations.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.client_name} - {new Date(exam.examination_date).toLocaleDateString()}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review order details and payment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total</span>
                        <span>KES {totals.total.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Advance Paid</span>
                        <span>KES {totals.advance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium text-primary">
                        <span>Balance Due</span>
                        <span>KES {totals.balance.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Advance Payment Method</Label>
                      <RadioGroup
                        value={saleDetails.advance_payment_method}
                        onValueChange={(value) => handleInputChange("advance_payment_method", value)}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted">
                          <RadioGroupItem value="Cash" id="cash" />
                          <Label htmlFor="cash" className="cursor-pointer">Cash</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted">
                          <RadioGroupItem value="Mpesa" id="mpesa" />
                          <Label htmlFor="mpesa" className="cursor-pointer">M-Pesa</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted">
                          <RadioGroupItem value="Card" id="card" />
                          <Label htmlFor="card" className="cursor-pointer">Credit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted">
                          <RadioGroupItem value="Bank" id="bank" />
                          <Label htmlFor="bank" className="cursor-pointer">Bank Transfer</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted col-span-2">
                          <RadioGroupItem value="Insurance" id="insurance" />
                          <Label htmlFor="insurance" className="cursor-pointer">Insurance</Label>
                        </div>
                      </RadioGroup>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Advance Paid (KES)</Label>
                          <Input
                            type="number"
                            value={saleDetails.advance_paid}
                            onChange={(e) => handleInputChange("advance_paid", Number(e.target.value))}
                            min="0"
                            step="0.01"
                          />
                        </div>
                        {saleDetails.advance_payment_method === "Mpesa" && (
                          <div className="space-y-2">
                            <Label>M-Pesa Transaction Code</Label>
                            <Input
                              placeholder="e.g., MPESA123456"
                              value={saleDetails.mpesa_transaction_code}
                              onChange={(e) => handleInputChange("mpesa_transaction_code", e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleSubmit} disabled={isProcessing}>
                    {isProcessing ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                    ) : (
                      <><CreditCard className="mr-2 h-4 w-4" /> Process Sale</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frame Details</CardTitle>
                  <CardDescription>Enter frame specifications and pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Brand</Label>
                        <Select
                          value={saleDetails.frame_brand}
                          onValueChange={(value) => handleInputChange("frame_brand", value)}
                        >
                          <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                          <SelectContent>
                            {FRAME_OPTIONS.brands.map((brand) => (
                              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Select
                          value={saleDetails.frame_model}
                          onValueChange={(value) => handleInputChange("frame_model", value)}
                        >
                          <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                          <SelectContent>
                            {saleDetails.frame_brand &&
                              FRAME_OPTIONS.models[saleDetails.frame_brand as keyof typeof FRAME_OPTIONS.models]?.map(
                                (model) => <SelectItem key={model} value={model}>{model}</SelectItem>
                              )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Select
                          value={saleDetails.frame_color}
                          onValueChange={(value) => handleInputChange("frame_color", value)}
                        >
                          <SelectTrigger><SelectValue placeholder="Select color" /></SelectTrigger>
                          <SelectContent>
                            {FRAME_OPTIONS.colors.map((color) => (
                              <SelectItem key={color} value={color}>{color}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={saleDetails.frame_quantity}
                          onChange={(e) => handleInputChange("frame_quantity", Number(e.target.value))}
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price (KES)</Label>
                        <Input
                          type="number"
                          value={saleDetails.frame_price}
                          onChange={(e) => handleInputChange("frame_price", Number(e.target.value))}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lens Details</CardTitle>
                  <CardDescription>Enter lens specifications and pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Brand</Label>
                        <Select
                          value={saleDetails.lens_brand}
                          onValueChange={(value) => handleInputChange("lens_brand", value)}
                        >
                          <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                          <SelectContent>
                            {LENS_OPTIONS.brands.map((brand) => (
                              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={saleDetails.lens_type}
                          onValueChange={(value) => handleInputChange("lens_type", value)}
                        >
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            {LENS_OPTIONS.types.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Material</Label>
                        <Select
                          value={saleDetails.lens_material}
                          onValueChange={(value) => handleInputChange("lens_material", value)}
                        >
                          <SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger>
                          <SelectContent>
                            {LENS_OPTIONS.materials.map((material) => (
                              <SelectItem key={material} value={material}>{material}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Coating</Label>
                        <Select
                          value={saleDetails.lens_coating}
                          onValueChange={(value) => handleInputChange("lens_coating", value)}
                        >
                          <SelectTrigger><SelectValue placeholder="Select coating" /></SelectTrigger>
                          <SelectContent>
                            {LENS_OPTIONS.coatings.map((coating) => (
                              <SelectItem key={coating} value={coating}>{coating}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={saleDetails.lens_quantity}
                          onChange={(e) => handleInputChange("lens_quantity", Number(e.target.value))}
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price (KES)</Label>
                        <Input
                          type="number"
                          value={saleDetails.lens_price}
                          onChange={(e) => handleInputChange("lens_price", Number(e.target.value))}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>Enter fitting instructions and delivery information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Fitting Instructions</Label>
                      <Textarea
                        value={saleDetails.fitting_instructions}
                        onChange={(e) => handleInputChange("fitting_instructions", e.target.value)}
                        placeholder="e.g., Ensure proper fitting and alignment."
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Delivery Date</Label>
                        <Input
                          type="date"
                          value={saleDetails.delivery_date}
                          onChange={(e) => handleInputChange("delivery_date", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Booked By</Label>
                        <Input
                          value={saleDetails.booked_by}
                          onChange={(e) => handleInputChange("booked_by", e.target.value)}
                          placeholder="e.g., Jane Doe"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent-sales">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>View and manage recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-7 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div>ID</div>
                  <div>Client</div>
                  <div>Frame</div>
                  <div>Lens</div>
                  <div>Total</div>
                  <div>Status</div>
                  <div className="text-right">Actions</div>
                </div>
                {recentSales.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No recent sales to display</div>
                ) : (
                  recentSales.map((sale) => (
                    <div key={sale.id} className="grid grid-cols-7 p-3 border-b text-sm">
                      <div>{sale.id.slice(0, 8)}</div>
                      <div>{sale.examination.client_name}</div>
                      <div>{sale.frame_brand}</div>
                      <div>{sale.lens_brand}</div>
                      <div>KES {sale.total_price.toLocaleString()}</div>
                      <div>{sale.order_paid}</div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <ArrowRight className="mr-2 h-4 w-4" /> Export Sales
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}