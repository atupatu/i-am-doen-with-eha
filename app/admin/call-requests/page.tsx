"use client"

import { useState } from "react"
import { ArrowUpDown, Check, ChevronDown, Filter, MoreHorizontal, Phone, Search, X } from "lucide-react"
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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Define TypeScript interfaces for our data
interface Client {
  id: string;
  name: string;
  phone: string;
}

interface CallRequest {
  id: string;
  client: Client;
  status: "pending" | "scheduled" | "completed" | "cancelled";
  requestDate: string;
  preferredTime: string;
  reason: string;
  notes: string;
  assignedTo: string | null;
  scheduledFor?: string;
  completedAt?: string;
  cancelledAt?: string;
}

// Mock data for call requests
const callRequests: CallRequest[] = [
  {
    id: "CR-1001",
    client: {
      id: "CL-1001",
      name: "Alice Johnson",
      phone: "+1 (555) 123-4567",
    },
    status: "pending",
    requestDate: "2023-06-10T09:30:00",
    preferredTime: "Morning",
    reason: "Discuss therapy progress",
    notes: "Client mentioned feeling anxious about upcoming session",
    assignedTo: null,
  },
  {
    id: "CR-1002",
    client: {
      id: "CL-1004",
      name: "David Wilson",
      phone: "+1 (555) 456-7890",
    },
    status: "scheduled",
    requestDate: "2023-06-09T14:15:00",
    preferredTime: "Afternoon",
    reason: "Billing question",
    notes: "Client has questions about insurance coverage",
    assignedTo: "Admin Staff",
    scheduledFor: "2023-06-12T15:00:00",
  },
  {
    id: "CR-1003",
    client: {
      id: "CL-1007",
      name: "Grace Lee",
      phone: "+1 (555) 789-0123",
    },
    status: "completed",
    requestDate: "2023-06-08T11:45:00",
    preferredTime: "Afternoon",
    reason: "Schedule change request",
    notes: "Client needs to reschedule next week's appointment",
    assignedTo: "Admin Staff",
    completedAt: "2023-06-08T16:30:00",
  },
  {
    id: "CR-1004",
    client: {
      id: "CL-1002",
      name: "Bob Smith",
      phone: "+1 (555) 234-5678",
    },
    status: "pending",
    requestDate: "2023-06-10T10:20:00",
    preferredTime: "Evening",
    reason: "New session inquiry",
    notes: "Client is interested in adding an extra session this week",
    assignedTo: null,
  },
  {
    id: "CR-1005",
    client: {
      id: "CL-1005",
      name: "Eva Martinez",
      phone: "+1 (555) 567-8901",
    },
    status: "cancelled",
    requestDate: "2023-06-07T13:10:00",
    preferredTime: "Morning",
    reason: "Technical issues",
    notes: "Client had trouble accessing the virtual session platform",
    assignedTo: "Tech Support",
    cancelledAt: "2023-06-07T15:45:00",
  },
]

export default function CallRequestsPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | CallRequest["status"]>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<CallRequest | null>(null)
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)

  const filteredRequests = callRequests.filter((request) => {
    // Filter by status
    if (filterStatus !== "all" && request.status !== filterStatus) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        request.client.name.toLowerCase().includes(query) ||
        request.reason.toLowerCase().includes(query) ||
        request.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleCallClick = (request: CallRequest) => {
    setSelectedRequest(request)
    setIsCallDialogOpen(true)
  }

  return (
    <div className="h-full flex flex-col">
      <AdminHeader title="Call Requests" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Client Call Requests</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search requests..."
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
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Requests</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("scheduled")}>Scheduled</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("completed")}>Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>Cancelled</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <CardTitle>Call Request List</CardTitle>
            <CardDescription>
              {filterStatus === "all" ? "Showing all call requests" : `Showing ${filterStatus} requests only`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Request Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Preferred Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={request.client.name} />
                          <AvatarFallback>
                            {request.client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{request.client.name}</div>
                          <div className="text-sm text-muted-foreground">{request.client.phone}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(request.requestDate).toLocaleString()}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>{request.preferredTime}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "completed"
                            ? "default"
                            : request.status === "pending"
                              ? "outline"
                              : request.status === "scheduled"
                                ? "secondary"
                                : "destructive"
                        }
                        className={
                          request.status === "completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : request.status === "scheduled"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : ""
                        }
                      >
                        {request.status === "completed" ? (
                          <>
                            <Check className="mr-1 h-3 w-3" /> Completed
                          </>
                        ) : request.status === "pending" ? (
                          "Pending"
                        ) : request.status === "scheduled" ? (
                          "Scheduled"
                        ) : (
                          <>
                            <X className="mr-1 h-3 w-3" /> Cancelled
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.assignedTo || "Unassigned"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {request.status === "pending" && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                            onClick={() => handleCallClick(request)}
                          >
                            <Phone className="h-4 w-4" />
                            <span className="sr-only">Call client</span>
                          </Button>
                        )}
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
                            <DropdownMenuItem>View client</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {request.status === "pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleCallClick(request)}>
                                  Call client
                                </DropdownMenuItem>
                                <DropdownMenuItem>Schedule call</DropdownMenuItem>
                                <DropdownMenuItem>Assign to staff</DropdownMenuItem>
                              </>
                            )}
                            {request.status === "scheduled" && (
                              <>
                                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                <DropdownMenuItem>Mark as completed</DropdownMenuItem>
                              </>
                            )}
                            {(request.status === "pending" || request.status === "scheduled") && (
                              <DropdownMenuItem className="text-red-600">Cancel request</DropdownMenuItem>
                            )}
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

      {selectedRequest && (
        <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Call Client</DialogTitle>
              <DialogDescription>You are about to call {selectedRequest.client.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={selectedRequest.client.name} />
                  <AvatarFallback className="text-xl">
                    {selectedRequest.client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-medium">{selectedRequest.client.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRequest.client.phone}</p>
                </div>
              </div>
              <div className="border rounded-md p-3">
                <h4 className="font-medium mb-1">Request Details</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-medium">Reason:</span> {selectedRequest.reason}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Notes:</span> {selectedRequest.notes}
                </p>
              </div>
              <div>
                <Label htmlFor="callNotes">Call Notes</Label>
                <Textarea id="callNotes" placeholder="Enter notes about the call..." className="mt-1" />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsCallDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 gap-2" onClick={() => setIsCallDialogOpen(false)}>
                <Phone className="h-4 w-4" />
                Place Call
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}