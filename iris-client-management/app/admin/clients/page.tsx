"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Download, Filter, ChevronLeft, ChevronRight, Mail, Phone, Calendar, Trash2, AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";

// Define the Client type
type Client = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  regNumber: string;
  lastAppointment: string;
};

// Sample client data
const sampleClients: Client[] = [
  { id: 1, firstName: "John", lastName: "Doe", email: "john.doe@example.com", phone: "0712345678", regNumber: "M/2025/03/001", lastAppointment: "2025-02-15" },
  { id: 2, firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", phone: "0723456789", regNumber: "M/2025/03/002", lastAppointment: "2025-02-14" },
  { id: 3, firstName: "Michael", lastName: "Brown", email: "michael.b@example.com", phone: "0734567890", regNumber: "M/2025/03/003", lastAppointment: "2025-02-13" },
  { id: 4, firstName: "Sarah", lastName: "Wilson", email: "sarah.w@example.com", phone: "0745678901", regNumber: "M/2025/03/004", lastAppointment: "2025-02-12" },
  { id: 5, firstName: "Robert", lastName: "Davis", email: "robert.d@example.com", phone: "0756789012", regNumber: "M/2025/03/005", lastAppointment: "2025-02-11" },
  { id: 6, firstName: "Emily", lastName: "Johnson", email: "emily.j@example.com", phone: "0767890123", regNumber: "M/2025/03/006", lastAppointment: "2025-02-10" },
  { id: 7, firstName: "David", lastName: "Miller", email: "david.m@example.com", phone: "0778901234", regNumber: "M/2025/03/007", lastAppointment: "2025-02-09" },
  { id: 8, firstName: "Lisa", lastName: "Anderson", email: "lisa.a@example.com", phone: "0789012345", regNumber: "M/2025/03/008", lastAppointment: "2025-02-08" },
  { id: 9, firstName: "James", lastName: "Taylor", email: "james.t@example.com", phone: "0790123456", regNumber: "M/2025/03/009", lastAppointment: "2025-02-07" },
  { id: 10, firstName: "Mary", lastName: "White", email: "mary.w@example.com", phone: "0701234567", regNumber: "M/2025/03/010", lastAppointment: "2025-02-06" },
  { id: 11, firstName: "Thomas", lastName: "Lee", email: "thomas.l@example.com", phone: "0713456789", regNumber: "M/2025/03/011", lastAppointment: "2025-02-05" },
  { id: 12, firstName: "Patricia", lastName: "Harris", email: "patricia.h@example.com", phone: "0724567890", regNumber: "M/2025/03/012", lastAppointment: "2025-02-04" },
  { id: 13, firstName: "Christopher", lastName: "Clark", email: "chris.c@example.com", phone: "0735678901", regNumber: "M/2025/03/013", lastAppointment: "2025-02-03" },
  { id: 14, firstName: "Jennifer", lastName: "Lewis", email: "jennifer.l@example.com", phone: "0746789012", regNumber: "M/2025/03/014", lastAppointment: "2025-02-02" },
  { id: 15, firstName: "William", lastName: "Walker", email: "william.w@example.com", phone: "0757890123", regNumber: "M/2025/03/015", lastAppointment: "2025-02-01" },
  { id: 16, firstName: "Susan", lastName: "Hall", email: "susan.h@example.com", phone: "0768901234", regNumber: "M/2025/03/016", lastAppointment: "2025-01-31" },
  { id: 17, firstName: "Joseph", lastName: "Allen", email: "joseph.a@example.com", phone: "0779012345", regNumber: "M/2025/03/017", lastAppointment: "2025-01-30" },
  { id: 18, firstName: "Margaret", lastName: "Young", email: "margaret.y@example.com", phone: "0780123456", regNumber: "M/2025/03/018", lastAppointment: "2025-01-29" },
  { id: 19, firstName: "Charles", lastName: "King", email: "charles.k@example.com", phone: "0791234567", regNumber: "M/2025/03/019", lastAppointment: "2025-01-28" },
  { id: 20, firstName: "Elizabeth", lastName: "Wright", email: "elizabeth.w@example.com", phone: "0702345678", regNumber: "M/2025/03/020", lastAppointment: "2025-01-27" },
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter clients
  const filteredClients = clients.filter(client =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery) ||
    client.regNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectedClients(checked ? paginatedClients.map(client => client.id) : []);
  };

  const handleSelectClient = (id: number, checked: boolean) => {
    setSelectedClients(prev =>
      checked ? [...prev, id] : prev.filter(clientId => clientId !== id)
    );
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = "First Name,Last Name,Email,Phone,Registration Number,Last Appointment\n";
    const csv = headers + filteredClients.map(client => 
      `${client.firstName},${client.lastName},${client.email},${client.phone},${client.regNumber},${client.lastAppointment}`
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "clients_export.csv";
    link.click();
  };

  // Delete selected clients
  const handleDeleteSelected = () => {
    if (selectedClients.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setClients(prev => prev.filter(client => !selectedClients.includes(client.id)));
    setSelectedClients([]);
    setIsDeleteDialogOpen(false);
  };

  // Delete single client
  const handleDeleteClient = (clientId: number) => {
    setSelectedClients([clientId]);
    setIsDeleteDialogOpen(true);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Clients</h1>
          <p className="text-muted-foreground">Explore and manage your client database</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={exportToCSV} className="hover:bg-primary/10 transition-colors">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Users className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      <Card className="shadow-lg border-none">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent rounded-t-lg">
          <CardTitle className="text-xl font-semibold text-primary">Client Directory</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center justify-between">
            <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
              <Input
                placeholder="Search by name, email, phone, or reg number..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border-muted focus:ring-2 focus:ring-primary"
              />
              <Button variant="outline" size="icon" className="hover:bg-primary/10">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              {selectedClients.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px] rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-muted/50">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedClients.length === paginatedClients.length && paginatedClients.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all clients on this page"
                  />
                </TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Reg Number</TableHead>
                <TableHead>Last Appointment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClients.length > 0 ? (
                paginatedClients.map((client) => (
                  <TableRow
                    key={client.regNumber}
                    className={cn(
                      "hover:bg-muted/20 transition-colors",
                      selectedClients.includes(client.id) && "bg-primary/10"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                        aria-label={`Select ${client.firstName} ${client.lastName}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{client.firstName}</TableCell>
                    <TableCell className="font-medium">{client.lastName}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.regNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{client.lastAppointment}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="hover:text-primary">View</Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-destructive"
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:text-primary">
                              Contact
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48">
                            <div className="space-y-2">
                              <Button variant="outline" className="w-full justify-start" asChild>
                                <a href={`mailto:${client.email}`}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Email
                                </a>
                              </Button>
                              <Button variant="outline" className="w-full justify-start" asChild>
                                <a href={`tel:${client.phone}`}>
                                  <Phone className="mr-2 h-4 w-4" />
                                  Call
                                </a>
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    No clients found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredClients.length)} of {filteredClients.length} clients
              {selectedClients.length > 0 && ` | ${selectedClients.length} selected`}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="rounded-full hover:bg-primary/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="rounded-full hover:bg-primary/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedClients.length} client{selectedClients.length > 1 ? "s" : ""}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}