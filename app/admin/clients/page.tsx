"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Download, Filter, MoreHorizontal, Search, UserPlus } from "lucide-react"
import { AdminHeader } from "@/components/admin/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for clients
const clients = [
  {
    id: "CL-1001",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    therapist: "Dr. Sarah Williams",
    joinedDate: "2023-01-15",
    lastSession: "2023-06-10",
    sessions: 12,
    payments: "$1,440.00",
  },
  {
    id: "CL-1002",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    therapist: "Dr. Michael Brown",
    joinedDate: "2023-02-20",
    lastSession: "2023-06-08",
    sessions: 8,
    payments: "$960.00",
  },
  {
    id: "CL-1003",
    name: "Carol Davis",
    email: "carol@example.com",
    phone: "+1 (555) 345-6789",
    status: "inactive",
    therapist: "Dr. Sarah Williams",
    joinedDate: "2023-01-05",
    lastSession: "2023-04-15",
    sessions: 6,
    payments: "$720.00",
  },
  {
    id: "CL-1004",
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1 (555) 456-7890",
    status: "active",
    therapist: "Dr. James Taylor",
    joinedDate: "2023-03-10",
    lastSession: "2023-06-12",
    sessions: 10,
    payments: "$1,200.00",
  },
  {
    id: "CL-1005",
    name: "Eva Martinez",
    email: "eva@example.com",
    phone: "+1 (555) 567-8901",
    status: "active",
    therapist: "Dr. Michael Brown",
    joinedDate: "2023-04-05",
    lastSession: "2023-06-09",
    sessions: 5,
    payments: "$600.00",
  },
  {
    id: "CL-1006",
    name: "Frank Thomas",
    email: "frank@example.com",
    phone: "+1 (555) 678-9012",
    status: "inactive",
    therapist: "Dr. James Taylor",
    joinedDate: "2023-02-15",
    lastSession: "2023-05-20",
    sessions: 7,
    payments: "$840.00",
  },
  {
    id: "CL-1007",
    name: "Grace Lee",
    email: "grace@example.com",
    phone: "+1 (555) 789-0123",
    status: "active",
    therapist: "Dr. Sarah Williams",
    joinedDate: "2023-05-01",
    lastSession: "2023-06-11",
    sessions: 3,
    payments: "$360.00",
  },
]

export default function ClientsPage() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClients = clients.filter((client) => {
    // Filter by status
    if (filterStatus !== "all" && client.status !== filterStatus) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  return (
    <div className="h-full flex flex-col">
      <AdminHeader title="Client Management" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
          <Button className="bg-[#a98cc8] hover:bg-[#9678b4]">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Clients</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active Clients</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>Inactive Clients</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select defaultValue="10">
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Entries per page</p>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle>Client List</CardTitle>
            <CardDescription>
              {filterStatus === "all"
                ? "Showing all clients"
                : filterStatus === "active"
                  ? "Showing active clients only"
                  : "Showing inactive clients only"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Therapist</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Sessions
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Payments
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Last Session</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={client.name} />
                          <AvatarFallback>
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">{client.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={client.status === "active" ? "default" : "secondary"}
                        className={client.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {client.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{client.therapist}</TableCell>
                    <TableCell>{client.sessions}</TableCell>
                    <TableCell>{client.payments}</TableCell>
                    <TableCell>{new Date(client.lastSession).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit client</DropdownMenuItem>
                          <DropdownMenuItem>View sessions</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Assign therapist</DropdownMenuItem>
                          <DropdownMenuItem>View payments</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}