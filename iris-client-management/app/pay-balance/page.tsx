"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useSearchClientWithBalance } from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { payBalance } from "@/actions";

const PayBalance = () => {
  const searchParams = useSearchParams();
  const regNoFromUrl = searchParams.get("reg_no")
    ? decodeURIComponent(searchParams.get("reg_no")!)
    : "";

  const [regNo, setRegNo] = useState(regNoFromUrl);
  const { clientData, loading, error, refetch } =
    useSearchClientWithBalance(regNo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [mpesaCode, setMpesaCode] = useState("");
  const [amountToPay, setAmountToPay] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (regNoFromUrl) {
      refetch();
    }
  }, [regNoFromUrl, refetch]);

  const handlePayClick = (clientId: string, balance: number) => {
    setSelectedClientId(clientId);
    setAmountToPay(balance.toString());
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;

    setIsSubmitting(true);
    try {
      const resp = await payBalance(selectedClientId, {
        advance_paid: Number(amountToPay),
      });

      if (resp?.message) {
        alert(resp.message);
        setIsModalOpen(false);
        refetch();
      } else if (resp?.error) {
        alert(resp.error);
      } else {
        alert("Unexpected response");
      }
    } catch (err) {
      console.error("Payment failed", err);
      alert("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Pay Balance</h1>

      {/* Search Input */}
      <div className="flex items-center gap-2 max-w-sm">
        <Input
          type="text"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
          placeholder="Enter Registration Number"
        />
        <Button size="icon" variant="ghost" onClick={refetch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Price (KSH)</TableHead>
              <TableHead>Advance Paid (KSH)</TableHead>
              <TableHead>Balance Due (KSH)</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Served By</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : clientData && clientData.length > 0 ? (
              clientData.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.total_price}</TableCell>
                  <TableCell>{client.advance_paid}</TableCell>
                  <TableCell className="text-red-600 font-bold">
                    {client.balance_due}
                  </TableCell>
                  <TableCell>{client.balance_payment_status}</TableCell>
                  <TableCell>{client.served_by}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        handlePayClick(client.id, Number(client.balance_due))
                      }
                    >
                      Pay Balance
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No client found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Payment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Balance</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-lg font-semibold">Amount to Pay:</p>
            <Input
              type="number"
              value={amountToPay}
              onChange={(e) => setAmountToPay(e.target.value)}
              required
            />
            <div className="flex gap-4">
              <Button
                type="button"
                variant={paymentMethod === "cash" ? "default" : "outline"}
                onClick={() => setPaymentMethod("cash")}
              >
                Cash
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "mpesa" ? "default" : "outline"}
                onClick={() => setPaymentMethod("mpesa")}
              >
                Mpesa
              </Button>
            </div>
            {paymentMethod === "mpesa" && (
              <Input
                type="text"
                value={mpesaCode}
                onChange={(e) => setMpesaCode(e.target.value)}
                placeholder="Enter Mpesa Transaction Code"
                required
              />
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm Payment"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayBalance;
