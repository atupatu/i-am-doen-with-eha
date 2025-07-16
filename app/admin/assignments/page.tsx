"use client"

import { useState } from "react"
import { ArrowUpDown, Calendar, ChevronDown, Filter, MoreHorizontal, Search, UserPlus } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock data for assignments
const assignments = [
  {
    id: "AS-1001",
    client: {
      id: "CL-1001",
      name: "Alice Johnson",
      email: "alice@example.com",
    },
    therapist: {
      id: "TH-001",
      name: "Dr. Sarah Williams",
    },
    status: "active",
    startDate: "2023-01-20",
    sessions: 12,
    nextSession: "2023-06-15",
    notes: "Weekly sessions for anxiety management",
  },
  {
    id: "AS-1002",
    client: {
      id: "CL-1002",
      name: "Bob Smith",
      email: "bob@example.com",
    },
    therapist: {
      id: "TH-002",
      name: "Dr. Michael Brown",
    },
    status: "active",
    startDate: "2023-02-25",
    sessions: 8,
    nextSession: "2023-06-18",
    notes: "Bi-weekly sessions for depression",
  },
  {
    id: "AS-1003",
    client: {
      id: "CL-1003",
      name: "Carol Davis",
      email: "carol@example.com",
    },
    therapist: {
      id: "TH-001",
      name: "Dr. Sarah Williams",
    },
    status: "inactive",
    startDate: "2023-01-10",
    sessions: 6,
    nextSession: null,
    notes: "Completed therapy program",
  },
  {
    id: "AS-1004",
    client: {
      id: "CL-1004",
      name: "David Wilson",
      email: "david@example.com",
    },
    therapist: {
      id: "TH-003",
      name: "Dr. James Taylor",
    },
    status: "active",
    startDate: "2023-03-15",
    sessions: 10,
    nextSession: "2023-06-20",
    notes: "Weekly sessions for stress management",
  },
  {
    id: "AS-1005",
    client: {
      id: "CL-1005",
      name: "Eva Martinez",
      email: "eva@example.com",
    },
    therapist: {
      id: "TH-002",
      name: "Dr. Michael Brown",
    },
    status: "active",
    startDate: "2023-04-10",
    sessions: 5,
    nextSession: "2023-06-17",
    notes: "Weekly sessions for grief counseling",
  },
]

// Mock data for available clients and therapists
const availableClients = [
  { id: "CL-1006", name: "Frank Thomas" },
  { id: "CL-1007", name: "Grace Lee" },
  { id: "CL-1008", name: "Henry Garcia" },
  { id: "CL-1009", name: "Irene Kim" },
]

const availableTherapists = [
  { id: "TH-001", name: "Dr. Sarah Williams" },
  { id: "TH-002", name: "Dr. Michael Brown" },
  { id: "TH-003", name: "Dr. James Taylor" },
  { id: "TH-005", name: "Dr. Robert Davis" },
]

export default function AssignmentsPage() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedTherapist, setSelectedTherapist] = useState("")

  const filteredAssignments = assignments.filter((assignment) => {
    // Filter by status
    if (filterStatus !== "all" && assignment.status !== filterStatus) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        assignment.client.name.toLowerCase().includes(query) ||
        assignment.therapist.name.toLowerCase().includes(query) ||
        assignment.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  return (
    <div className="h-full flex flex-col">
      <AdminHeader title="Client-Therapist Assignments" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#a98cc8] hover:bg-[#9678b4]">
                <UserPlus className="mr-2 h-4 w-4" />
                New Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Assign Client to Therapist</DialogTitle>
                <DialogDescription>Select a client and therapist to create a new assignment.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client" className="text-right">
                    Client
                  </Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="therapist" className="text-right">
                    Therapist
                  </Label>
                  <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select therapist" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTherapists.map((therapist) => (
                        <SelectItem key={therapist.id} value={therapist.id}>
                          {therapist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    className="col-span-3"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Input id="notes" placeholder="Session frequency, focus areas, etc." className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#a98cc8] hover:bg-[#9678b4]"
                  onClick={() => {
                    // Handle assignment creation
                    setIsAssignDialogOpen(false)
                    setSelectedClient("")
                    setSelectedTherapist("")
                  }}
                >
                  Create Assignment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assignments..."
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
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Assignments</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active Assignments</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>Inactive Assignments</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle>Client-Therapist Assignments</CardTitle>
            <CardDescription>
              {filterStatus === "all"
                ? "Showing all assignments"
                : filterStatus === "active"
                  ? "Showing active assignments only"
                  : "Showing inactive assignments only"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Sessions
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Next Session</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={assignment.client.name} />
                          <AvatarFallback>
                            {assignment.client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{assignment.client.name}</div>
                          <div className="text-sm text-muted-foreground">{assignment.client.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={assignment.therapist.name} />
                          <AvatarFallback>
                            {assignment.therapist.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{assignment.therapist.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={assignment.status === "active" ? "default" : "secondary"}
                        className={
                          assignment.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                        }
                      >
                        {assignment.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(assignment.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{assignment.sessions}</TableCell>
                    <TableCell>
                      {assignment.nextSession ? new Date(assignment.nextSession).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Calendar className="h-4 w-4" />
                          <span className="sr-only">Schedule</span>
                        </Button>
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
                            <DropdownMenuItem>Edit assignment</DropdownMenuItem>
                            <DropdownMenuItem>Schedule session</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View sessions</DropdownMenuItem>
                            <DropdownMenuItem>View client details</DropdownMenuItem>
                            <DropdownMenuItem>View therapist details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">End assignment</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
