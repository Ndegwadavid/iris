// app/clients/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Search, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Client, fetchClients } from "@/lib/clients";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function ExistingClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      try {
        const clients = await fetchClients("");
        setFilteredClients(clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to load clients",
          variant: "destructive",
        });
        setFilteredClients([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadClients();
  }, [toast]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    try {
      const clients = await fetchClients(query);
      setFilteredClients(clients);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Error",
        description: "Failed to search clients",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground">
        Loading clients...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Existing Clients</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Existing Client</CardTitle>
          <CardDescription>
            Search by name, phone number, or email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Start typing to search..."
              value={searchQuery}
              onChange={handleSearch}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.length === 0 ? (
          <div className="text-center text-muted-foreground col-span-full">
            No clients found.
          </div>
        ) : (
          filteredClients.map((client) => (
            <Card key={client.id} className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {client.first_name} {client.last_name}
                </CardTitle>
                <CardDescription>Reg No: {client.reg_no}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">DOB:</dt>
                    <dd>{client.dob || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">
                      Phone:
                    </dt>
                    <dd>{client.phone_number || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">
                      Email:
                    </dt>
                    <dd>{client.email || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">
                      Last Visit:
                    </dt>
                    <dd>
                      {client.last_examination_date
                        ? new Date(
                            client.last_examination_date
                          ).toLocaleDateString()
                        : "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">
                      Visit Count:
                    </dt>
                    <dd>{client.visit_count || 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">
                      Latest Exam ID:
                    </dt>
                    <dd>{client.latest_examination_id || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="font-medium text-muted-foreground">
                      Balance:
                    </dt>
                    <dd>
                      {client.balance !== undefined
                        ? `KSH ${client.balance.toFixed(2)}`
                        : "N/A"}
                      {client.payment_status && (
                        <Badge
                          className="ml-2"
                          variant={
                            client.payment_status === "fully_paid"
                              ? "default"
                              : client.payment_status === "pending_balance"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {client.payment_status.replace("_", " ")}
                        </Badge>
                      )}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex justify-between gap-2 flex-wrap">
                  <Link href={`/clients/client?id=${client.id}`}>
                    <Button size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    onClick={() =>
                      toast({
                        title: "Coming Soon",
                        description:
                          "New Examination feature is under development.",
                      })
                    }
                  >
                    New Examination
                  </Button>
                  {client.balance &&
                    client.balance > 0 &&
                    client.id && (
                      <Link
                        href={`/pay-balance?reg_no=${client.reg_no}`}
                      >
                        <Button size="sm" variant="secondary">
                          Pay Balance
                        </Button>
                      </Link>
                    )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
