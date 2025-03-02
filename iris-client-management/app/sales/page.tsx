"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  Eye,
  FileText,
  Loader2,
  Search,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { FRAME_OPTIONS, LENS_OPTIONS } from "@/lib/constants"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const clients = [
  { id: 1, regNo: "M/2024/03/0001", name: "John Doe", phone: "+254712345678" },
  { id: 2, regNo: "M/2024/03/0002", name: "Jane Smith", phone: "+254723456789" },
  { id: 3, regNo: "M/2024/03/0003", name: "Michael Brown", phone: "+254734567890" },
]

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState("new-sale")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { toast } = useToast()

  const [saleDetails, setSaleDetails] = useState({
    frame: { brand: "", model: "", color: "", quantity: "1", price: "0" },
    lens: { brand: "", type: "", material: "", coating: "", quantity: "1", price: "0" },
    payment: {
      subtotal: 0,
      tax: 0,
      total: 0,
      advance: { cash: "0", mpesa: "0", card: "0", bank: "0", insurance: "0" },
      advanceTotal: 0,
      mpesaTransactionCode: "",
      paymentMethod: "cash",
      balance: 0,
    },
    order: { reference: "", fittingInstructions: "", deliveryDate: "", bookedBy: "" },
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const results = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery) ||
        client.regNo.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setSearchResults(results)
  }

  const selectClient = (client: any) => {
    setSelectedClient(client)
    setSearchResults([])
    setSearchQuery("")
  }

  const calculateTotals = () => {
    const framePrice = parseFloat(saleDetails.frame.price) || 0
    const frameQuantity = parseInt(saleDetails.frame.quantity) || 0
    const lensPrice = parseFloat(saleDetails.lens.price) || 0
    const lensQuantity = parseInt(saleDetails.lens.quantity) || 0

    const frameTotal = framePrice * frameQuantity
    const lensTotal = lensPrice * lensQuantity
    const subtotal = frameTotal + lensTotal
    const tax = 0
    const total = subtotal + tax

    const advanceTotal =
      (parseFloat(saleDetails.payment.advance.cash) || 0) +
      (parseFloat(saleDetails.payment.advance.mpesa) || 0) +
      (parseFloat(saleDetails.payment.advance.card) || 0) +
      (parseFloat(saleDetails.payment.advance.bank) || 0) +
      (parseFloat(saleDetails.payment.advance.insurance) || 0)

    const balance = total - advanceTotal

    return { subtotal, tax, total, advanceTotal, balance }
  }

  useEffect(() => {
    const totals = calculateTotals()
    setSaleDetails((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        ...totals,
      },
    }))
  }, [
    saleDetails.frame.price,
    saleDetails.frame.quantity,
    saleDetails.lens.price,
    saleDetails.lens.quantity,
    saleDetails.payment.advance.cash,
    saleDetails.payment.advance.mpesa,
    saleDetails.payment.advance.card,
    saleDetails.payment.advance.bank,
    saleDetails.payment.advance.insurance,
  ])

  const handleInputChange = (section: string, field: string, value: string) => {
    if (section === "payment.advance") {
      const numericValue = value.replace(/[^0-9.]/g, "")
      setSaleDetails((prev) => ({
        ...prev,
        payment: {
          ...prev.payment,
          advance: {
            ...prev.payment.advance,
            [field]: numericValue,
          },
        },
      }))
      return
    }

    if (section === "payment" && field !== "paymentMethod" && field !== "mpesaTransactionCode") {
      setSaleDetails((prev) => ({
        ...prev,
        payment: {
          ...prev.payment,
          [field]: value,
        },
      }))
      return
    }

    const updatedValue = (field === "quantity" || field === "price")
      ? value.replace(/[^0-9.]/g, "")
      : value

    setSaleDetails((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof saleDetails],
        [field]: updatedValue,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient) {
      toast({ title: "Client required", description: "Please select a client", variant: "destructive" })
      return
    }

    setIsProcessing(true)
    const referenceNumber = `SO${Date.now().toString().slice(-6)}`

    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)

      toast({ title: "Sale recorded", description: `Reference: ${referenceNumber}` })

      setTimeout(() => {
        setIsComplete(false)
        setSelectedClient(null)
        setSaleDetails({
          frame: { brand: "", model: "", color: "", quantity: "1", price: "0" },
          lens: { brand: "", type: "", material: "", coating: "", quantity: "1", price: "0" },
          payment: {
            subtotal: 0,
            tax: 0,
            total: 0,
            advance: { cash: "0", mpesa: "0", card: "0", bank: "0", insurance: "0" },
            advanceTotal: 0,
            mpesaTransactionCode: "",
            paymentMethod: "cash",
            balance: 0,
          },
          order: { reference: "", fittingInstructions: "", deliveryDate: "", bookedBy: "" },
        })
        setActiveTab("recent-sales")
      }, 2000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
          <p className="text-muted-foreground">Process sales and manage transactions</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-sale"><ShoppingCart className="mr-2 h-4 w-4" />New Sale</TabsTrigger>
          <TabsTrigger value="recent-sales"><ShoppingBag className="mr-2 h-4 w-4" />Recent Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="new-sale" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                  <CardDescription>Search and select a client</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedClient ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{selectedClient.name}</h3>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedClient(null)}>Change</Button>
                      </div>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between"><span className="text-muted-foreground">Reg No:</span><span>{selectedClient.regNo}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span><span>{selectedClient.phone}</span></div>
                      </div>
                      <div className="pt-2">
                        <Link href={`/clients/client?id=${selectedClient.id}`}>
                          <Button variant="outline" size="sm" className="w-full"><Eye className="mr-2 h-4 w-4" />View Full Profile</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSearch} className="space-y-4">
                      <div className="flex gap-2">
                        <Input placeholder="Search by name, reg no, or phone" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <Button type="submit" size="icon"><Search className="h-4 w-4" /></Button>
                      </div>
                      {searchResults.length > 0 && (
                        <div className="border rounded-md overflow-hidden">
                          {searchResults.map((client) => (
                            <div key={client.id} className="p-2 hover:bg-muted cursor-pointer flex justify-between items-center border-b last:border-0" onClick={() => selectClient(client)}>
                              <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-xs text-muted-foreground">{client.regNo}</p>
                              </div>
                              <Button variant="ghost" size="sm">Select</Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </form>
                  )}
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
                      <div className="flex justify-between text-sm"><span>Subtotal</span><span>KES {saleDetails.payment.subtotal.toLocaleString()}</span></div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium"><span>Total</span><span>KES {saleDetails.payment.total.toLocaleString()}</span></div>
                      <div className="flex justify-between text-sm text-muted-foreground"><span>Advance Paid</span><span>KES {saleDetails.payment.advanceTotal.toLocaleString()}</span></div>
                      <div className="flex justify-between font-medium text-primary"><span>Balance Due</span><span>KES {saleDetails.payment.balance.toLocaleString()}</span></div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Advance Payment Method</Label>
                      <RadioGroup
                        value={saleDetails.payment.paymentMethod}
                        onValueChange={(value) => handleInputChange("payment", "paymentMethod", value)}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex items-center cursor-pointer"><img src="/icons/cash.png" alt="Cash" className="h-6 w-6 mr-2" />Cash</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted">
                          <RadioGroupItem value="mpesa" id="mpesa" />
                          <Label htmlFor="mpesa" className="flex items-center cursor-pointer"><img src="/icons/mpesa.png" alt="M-Pesa" className="h-6 w-6 mr-2" />M-Pesa</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted opacity-50">
                          <RadioGroupItem value="card" id="card" disabled />
                          <Label htmlFor="card" className="flex items-center cursor-not-allowed"><img src="/icons/card.png" alt="Card" className="h-6 w-6 mr-2" />Credit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted opacity-50">
                          <RadioGroupItem value="bank" id="bank" disabled />
                          <Label htmlFor="bank" className="flex items-center cursor-not-allowed"><img src="/icons/bank.png" alt="Bank" className="h-6 w-6 mr-2" />Bank Transfer</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted col-span-2">
                          <RadioGroupItem value="insurance" id="insurance" />
                          <Label htmlFor="insurance" className="flex items-center cursor-pointer"><FileText className="h-6 w-6 mr-2" />Insurance</Label>
                        </div>
                      </RadioGroup>

                      <div className="space-y-4">
                        {saleDetails.payment.paymentMethod === "cash" && (
                          <div className="space-y-2">
                            <Label>Cash Advance (KES)</Label>
                            <Input
                              type="text"
                              inputMode="numeric"
                              placeholder="Enter advance amount"
                              value={saleDetails.payment.advance.cash}
                              onChange={(e) => handleInputChange("payment.advance", "cash", e.target.value)}
                            />
                          </div>
                        )}
                        {saleDetails.payment.paymentMethod === "mpesa" && (
                          <>
                            <div className="space-y-2">
                              <Label>M-Pesa Advance (KES)</Label>
                              <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="Enter advance amount"
                                value={saleDetails.payment.advance.mpesa}
                                onChange={(e) => handleInputChange("payment.advance", "mpesa", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>M-Pesa Transaction Code</Label>
                              <Input
                                placeholder="Enter transaction code"
                                value={saleDetails.payment.mpesaTransactionCode}
                                onChange={(e) => handleInputChange("payment", "mpesaTransactionCode", e.target.value)}
                              />
                            </div>
                            <Button type="button" variant="outline" size="sm" className="w-full">
                              <Loader2 className="mr-2 h-4 w-4" />Simulate M-Pesa Prompt
                            </Button>
                          </>
                        )}
                        {saleDetails.payment.paymentMethod === "insurance" && (
                          <div className="space-y-2">
                            <Label>Insurance Advance (KES)</Label>
                            <Input
                              type="text"
                              inputMode="numeric"
                              placeholder="Enter advance amount"
                              value={saleDetails.payment.advance.insurance}
                              onChange={(e) => handleInputChange("payment.advance", "insurance", e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleSubmit} disabled={!selectedClient || isProcessing || isComplete}>
                    {isProcessing ? (
                      <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing... </>
                    ) : isComplete ? (
                      <> <CheckCircle className="mr-2 h-4 w-4" /> Completed </>
                    ) : (
                      <> <CreditCard className="mr-2 h-4 w-4" /> Process Sale </>
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
                        <Select value={saleDetails.frame.brand} onValueChange={(value) => handleInputChange("frame", "brand", value)}>
                          <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                          <SelectContent>
                            {FRAME_OPTIONS.brands.map((brand) => <SelectItem key={brand} value={brand}>{brand}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Select value={saleDetails.frame.model} onValueChange={(value) => handleInputChange("frame", "model", value)}>
                          <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                          <SelectContent>
                            {saleDetails.frame.brand && FRAME_OPTIONS.models[saleDetails.frame.brand as keyof typeof FRAME_OPTIONS.models].map((model) => (
                              <SelectItem key={model} value={model}>{model}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Select value={saleDetails.frame.color} onValueChange={(value) => handleInputChange("frame", "color", value)}>
                          <SelectTrigger><SelectValue placeholder="Select color" /></SelectTrigger>
                          <SelectContent>
                            {FRAME_OPTIONS.colors.map((color) => <SelectItem key={color} value={color}>{color}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={saleDetails.frame.quantity}
                          onChange={(e) => handleInputChange("frame", "quantity", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price (KES)</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter price"
                          value={saleDetails.frame.price}
                          onChange={(e) => handleInputChange("frame", "price", e.target.value)}
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
                        <Select value={saleDetails.lens.brand} onValueChange={(value) => handleInputChange("lens", "brand", value)}>
                          <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                          <SelectContent>
                            {LENS_OPTIONS.brands.map((brand) => <SelectItem key={brand} value={brand}>{brand}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={saleDetails.lens.type} onValueChange={(value) => handleInputChange("lens", "type", value)}>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            {LENS_OPTIONS.types.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Material</Label>
                        <Select value={saleDetails.lens.material} onValueChange={(value) => handleInputChange("lens", "material", value)}>
                          <SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger>
                          <SelectContent>
                            {LENS_OPTIONS.materials.map((material) => <SelectItem key={material} value={material}>{material}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Coating</Label>
                        <Select value={saleDetails.lens.coating} onValueChange={(value) => handleInputChange("lens", "coating", value)}>
                          <SelectTrigger><SelectValue placeholder="Select coating" /></SelectTrigger>
                          <SelectContent>
                            {LENS_OPTIONS.coatings.map((coating) => <SelectItem key={coating} value={coating}>{coating}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={saleDetails.lens.quantity}
                          onChange={(e) => handleInputChange("lens", "quantity", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price (KES)</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter price"
                          value={saleDetails.lens.price}
                          onChange={(e) => handleInputChange("lens", "price", e.target.value)}
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
                        placeholder="Enter any specific fitting instructions or notes"
                        value={saleDetails.order.fittingInstructions}
                        onChange={(e) => handleInputChange("order", "fittingInstructions", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Delivery Date</Label>
                        <Input
                          type="date"
                          value={saleDetails.order.deliveryDate}
                          onChange={(e) => handleInputChange("order", "deliveryDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Booked By</Label>
                        <Input
                          placeholder="Staff name"
                          value={saleDetails.order.bookedBy}
                          onChange={(e) => handleInputChange("order", "bookedBy", e.target.value)}
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
                  <div>Reference</div><div>Client</div><div>Frame</div><div>Lens</div><div>Total</div><div>Status</div><div className="text-right">Actions</div>
                </div>
                <div className="p-4 text-center text-sm text-muted-foreground">No recent sales to display</div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline"><FileText className="mr-2 h-4 w-4" />Export Sales</Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon"><ArrowRight className="h-4 w-4" /></Button>
                <span className="text-sm text-muted-foreground">Page 1 of 1</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}