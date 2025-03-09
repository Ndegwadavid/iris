"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Glasses, Download, Filter, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";

// Define the InventoryItem type
type InventoryItem = {
  id: number;
  brand: string;
  model: string;
  frameType: "Full Rim" | "Rimless" | "Half Rim";
  lensType: "Single Vision" | "Bifocal" | "Progressive";
};

// Sample inventory data
const sampleInventory: InventoryItem[] = [
  { id: 1, brand: "Ray-Ban", model: "Aviator Classic", frameType: "Full Rim", lensType: "Single Vision" },
  { id: 2, brand: "Oakley", model: "Frogskins", frameType: "Full Rim", lensType: "Progressive" },
  { id: 3, brand: "Gucci", model: "GG0061S", frameType: "Rimless", lensType: "Bifocal" },
  { id: 4, brand: "Prada", model: "PR 17WV", frameType: "Half Rim", lensType: "Single Vision" },
  { id: 5, brand: "Tom Ford", model: "FT5401", frameType: "Full Rim", lensType: "Progressive" },
  { id: 6, brand: "Persol", model: "PO3092V", frameType: "Half Rim", lensType: "Bifocal" },
];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory);

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      `${item.brand} ${item.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.frameType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lensType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || item.frameType === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInventory = filteredInventory.slice(startIndex, startIndex + itemsPerPage);

  // Export to CSV
  const exportToCSV = () => {
    const headers = "Brand,Model,Frame Type,Lens Type\n";
    const csv = headers + filteredInventory.map(item => 
      `${item.brand},${item.model},${item.frameType},${item.lensType}`
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory_export.csv";
    link.click();
  };

  // Database Integration Section (Commented Out)
  /*
  // Fetch inventory from the database on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/inventory', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${yourAuthToken}`, // Uncomment and add token if required
          },
        });
        if (!response.ok) throw new Error('Failed to fetch inventory');
        const data: InventoryItem[] = await response.json();
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setInventory(sampleInventory); // Fallback to sample data on error
      }
    };

    fetchInventory();
  }, []);

  // Add new inventory item to the database
  const addInventoryItem = async (newItem: Omit<InventoryItem, 'id'>) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error('Failed to add inventory item');
      const addedItem: InventoryItem = await response.json();
      setInventory(prev => [...prev, addedItem]);
    } catch (error) {
      console.error("Error adding inventory item:", error);
    }
  };

  // Example usage with database
  // const handleAddInventory = () => {
  //   const newItem = { brand: "New Brand", model: "New Model", frameType: "Full Rim", lensType: "Single Vision" };
  //   addInventoryItem(newItem);
  // };
  */

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Eyewear Inventory</h1>
          <p className="text-muted-foreground">Track and manage your eyewear stock with style</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={exportToCSV} className="hover:bg-primary/10 transition-colors">
            <Download className="mr-2 h-4 w-4" />
            Export Stock
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Glasses className="mr-2 h-4 w-4" />
            Add Inventory
          </Button>
        </div>
      </div>

      {/* Stock Overview */}
      <Card className="shadow-lg border-none">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent rounded-t-lg">
          <CardTitle className="text-xl font-semibold text-primary">Stock Overview</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center justify-between">
            <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
              <Input
                placeholder="Search by brand, model, or type..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border-muted focus:ring-2 focus:ring-primary"
              />
              <Button variant="outline" size="icon" className="hover:bg-primary/10">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[140px] rounded-lg">
                  <SelectValue placeholder="Filter by Frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Frames</SelectItem>
                  <SelectItem value="Full Rim">Full Rim</SelectItem>
                  <SelectItem value="Rimless">Rimless</SelectItem>
                  <SelectItem value="Half Rim">Half Rim</SelectItem>
                </SelectContent>
              </Select>
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
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Frame Type</TableHead>
                <TableHead>Lens Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInventory.length > 0 ? (
                paginatedInventory.map((item) => (
                  <TableRow
                    key={item.id}
                    className={cn("hover:bg-muted/20 transition-colors")}
                  >
                    <TableCell className="font-medium">{item.brand}</TableCell>
                    <TableCell>{item.model}</TableCell>
                    <TableCell>{item.frameType}</TableCell>
                    <TableCell>{item.lensType}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No inventory items found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInventory.length)} of {filteredInventory.length} items
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
    </div>
  );
}