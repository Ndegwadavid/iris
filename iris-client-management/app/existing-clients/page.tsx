"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, Search, User } from "lucide-react"
import Link from "next/link"

// Dummy client data
const clients = [
  {
    id: 1,
    name: "John Doe",
    dob: "1985-05-12",
    phone: "+254712345678",
    email: "john.doe@example.com",
    lastVisit: "2023-10-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    dob: "1990-08-22",
    phone: "+254723456789",
    email: "jane.smith@example.com",
    lastVisit: "2023-11-05",
  },
  {
    id: 3,
    name: "Michael Brown",
    dob: "1978-03-30",
    phone: "+254734567890",
    email: "michael.brown@example.com",
    lastVisit: "2023-09-28",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    dob: "1992-11-18",
    phone: "+254745678901",
    email: "sarah.wilson@example.com",
    lastVisit: "2023-12-02",
  },
  {
    id: 5,
    name: "Robert Davis",
    dob: "1965-07-04",
    phone: "+254756789012",
    email: "robert.davis@example.com",
    lastVisit: "2023-10-30",
  },
  {
    id: 6,
    name: "Emily Johnson",
    dob: "1988-12-25",
    phone: "+254767890123",
    email: "emily.johnson@example.com",
    lastVisit: "2023-11-22",
  },
  {
    id: 7,
    name: "David Thompson",
    dob: "1982-09-14",
    phone: "+254778901234",
    email: "david.thompson@example.com",
    lastVisit: "2023-12-10",
  },
  {
    id: 8,
    name: "Lisa Anderson",
    dob: "1975-06-30",
    phone: "+254789012345",
    email: "lisa.anderson@example.com",
    lastVisit: "2023-11-15",
  },
]

export default function ExistingClientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredClients, setFilteredClients] = useState(clients)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query.trim() === "") {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(query) ||
          client.phone.includes(query) ||
          client.email.toLowerCase().includes(query),
      )
      setFilteredClients(filtered)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Existing Clients</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Existing Client</CardTitle>
          <CardDescription>Search by name, phone number, or email</CardDescription>
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
        {filteredClients.map((client) => (
          <Card key={client.id} className="overflow-hidden">
            <CardHeader className="bg-primary/5 pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                {client.name}
              </CardTitle>
              <CardDescription>ID: {client.id}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">Date of Birth:</dt>
                  <dd>{client.dob}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">Phone:</dt>
                  <dd>{client.phone}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">Last Visit:</dt>
                  <dd>{client.lastVisit}</dd>
                </div>
              </dl>
              <div className="mt-4 flex justify-between">
                <Link href={`/clients/client?id=${client.id}`}>
                  <Button size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
                <Link href="/examination">
                  <Button size="sm" variant="outline">
                    New Examination
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

