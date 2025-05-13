"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Client, fetchClients } from "@/lib/clients";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadClients("");
  }, [toast]);

  const loadClients = async (query: string) => {
    setIsLoading(true);
    try {
      const data = await fetchClients(query);
      setClients(data);
      if (data.length === 0 && !query) {
        toast({
          title: "Info",
          description: "No clients found in the database.",
          variant: "default",
        });
      } else if (data.length === 0 && query) {
        toast({
          title: "Info",
          description: "No clients match your search.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect to the server",
        variant: "destructive",
      });
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    loadClients(searchQuery);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">All Clients</h1>
        <Link href="/reception">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Input
          placeholder="Search clients by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button size="icon" variant="ghost" onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Loading clients...
                </TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.reg_no}</TableCell>
                  <TableCell>{`${client.first_name} ${client.last_name}`}</TableCell>
                  <TableCell>{client.dob || "N/A"}</TableCell>
                  <TableCell>{client.phone_number || "N/A"}</TableCell>
                  <TableCell>{client.email || "N/A"}</TableCell>
                  <TableCell>
                    {client.last_examination_date
                      ? new Date(client.last_examination_date).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/clients/client/${client.id}`}> {/* Updated to dynamic route */}
                      <Button size="sm" variant="ghost">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Toaster />
    </div>
  );
}