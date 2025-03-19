// app/sales/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ArrowRight, Loader2, ShoppingBag, ShoppingCart } from "lucide-react";
import { FRAME_OPTIONS, LENS_OPTIONS } from "@/lib/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Examination, Sale } from "@/lib/sales";
import Image from "next/image";

type SalePayload = {
  examination: string;
  frame_brand: string;
  frame_model: string;
  frame_color: string;
  frame_quantity: number;
  frame_price: number;
  lens_brand: string;
  lens_type: string;
  lens_material: string;
  lens_coating: string;
  lens_quantity: number;
  lens_price: number;
  fitting_instructions: string;
  delivery_date: string;
  booked_by: string;
  payment_method: string;
  advance_paid: number;
  total_paid: number;
  mpesa_transaction_code?: string;
};

const API_BASE_URL = "http://localhost:3000/api/sales";

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState("new-sale");
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>("");
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
    payment_method: "Cash",
    advance_paid: 0,
    total_paid: 0,
    mpesa_transaction_code: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadExaminations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/examinations`, { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch examinations");
        const data = await response.json();
        setExaminations(data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load examinations", variant: "destructive" });
      }
    };
    loadExaminations();
  }, [toast]);

  useEffect(() => {
    const loadRecentSales = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/recent`, { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch recent sales");
        const data = await response.json();
        setRecentSales(data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load recent sales", variant: "destructive" });
      }
    };
    if (activeTab === "recent-sales") loadRecentSales();
  }, [activeTab, toast]);

  const handleInputChange = (field: keyof SalePayload, value: string | number) => {
    setSaleDetails((prev) => ({
      ...prev,
      [field]: typeof value === "number" ? Math.floor(value) : value,
    }));
  };

  const calculateTotals = () => {
    const frameTotal = saleDetails.frame_price * saleDetails.frame_quantity;
    const lensTotal = saleDetails.lens_price * saleDetails.lens_quantity;
    const total = frameTotal + lensTotal;
    const advance = saleDetails.advance_paid || 0;
    const paid = saleDetails.total_paid || 0;
    const balance = total - paid; // Balance is total minus total paid
    return { total, advance, paid, balance };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) {
      toast({ title: "Error", description: "Please select an examination", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    const payload: SalePayload = {
      ...saleDetails,
      examination: selectedExam,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create sale");
      }

      const result = await response.json();
      setIsProcessing(false);
      toast({
        title: "Sale Completed",
        description: "The sale has been successfully recorded.",
        variant: "default",
      });

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
        payment_method: "Cash",
        advance_paid: 0,
        total_paid: 0,
        mpesa_transaction_code: "",
      });
      setSelectedExam("");
      setActiveTab("recent-sales");

      const salesResponse = await fetch(`${API_BASE_URL}/recent`, { credentials: "include" });
      if (salesResponse.ok) setRecentSales(await salesResponse.json());
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process sale",
        variant: "destructive",
      });
    }
  };

  const totals = calculateTotals();
  const selectedClient = examinations.find((exam) => exam.id === selectedExam);

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
                  {selectedClient && (
                    <div className="mt-4 text-sm">
                      <p><strong>Client:</strong> {selectedClient.client_name}</p>
                      <p><strong>Reg No:</strong> {selectedClient.client.reg_no}</p>
                      <p><strong>Last Exam:</strong> {new Date(selectedClient.client.last_examination_date).toLocaleDateString()}</p>
                    </div>
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
                      <div className="flex justify-between text-sm">
                        <span>Total</span>
                        <span>KES {totals.total.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Advance Paid</span>
                        <span>KES {totals.advance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Total Paid</span>
                        <span>KES {totals.paid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium text-primary">
                        <span>Balance Due</span>
                        <span>KES {totals.balance.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Payment Method</Label>
                      <RadioGroup
                        value={saleDetails.payment_method}
                        onValueChange={(value) => handleInputChange("payment_method", value)}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted">
                          <RadioGroupItem value="Cash" id="cash" />
                          <Image src="/icons/cash.png" alt="Cash" width={20} height={20} />
                          <Label htmlFor="cash" className="cursor-pointer">Cash</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted">
                          <RadioGroupItem value="Mpesa" id="mpesa" />
                          <Image src="/icons/mpesa.png" alt="M-Pesa" width={20} height={20} />
                          <Label htmlFor="mpesa" className="cursor-pointer">M-Pesa</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-not-allowed opacity-50">
                          <RadioGroupItem value="Card" id="card" disabled />
                          <Image src="/icons/card.png" alt="Card" width={20} height={20} />
                          <Label htmlFor="card" className="cursor-not-allowed">Credit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-4 cursor-not-allowed opacity-50">
                          <RadioGroupItem value="Bank" id="bank" disabled />
                          <Image src="/icons/bank.png" alt="Bank" width={20} height={20} />
                          <Label htmlFor="bank" className="cursor-not-allowed">Bank Transfer</Label>
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
                            onChange={(e) => handleInputChange("advance_paid", Math.floor(Number(e.target.value)))}
                            min="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Total Paid (KES)</Label>
                          <Input
                            type="number"
                            value={saleDetails.total_paid}
                            onChange={(e) => handleInputChange("total_paid", Math.floor(Number(e.target.value)))}
                            min="0"
                          />
                        </div>
                        {saleDetails.payment_method === "Mpesa" && (
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
                      <>Process Sale</>
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
                          onChange={(e) => handleInputChange("frame_quantity", Math.floor(Number(e.target.value)))}
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price (KES)</Label>
                        <Input
                          type="number"
                          value={saleDetails.frame_price}
                          onChange={(e) => handleInputChange("frame_price", Math.floor(Number(e.target.value)))}
                          min="0"
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
                          onChange={(e) => handleInputChange("lens_quantity", Math.floor(Number(e.target.value)))}
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price (KES)</Label>
                        <Input
                          type="number"
                          value={saleDetails.lens_price}
                          onChange={(e) => handleInputChange("lens_price", Math.floor(Number(e.target.value)))}
                          min="0"
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
                  <div>Client Name</div>
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
  );
}