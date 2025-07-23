"use client"

import { useState } from "react"
import { ArrowUpDown, Calendar, ChevronDown, Download, FileText, Filter, MoreHorizontal, Search } from "lucide-react"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define TypeScript interfaces for your data structures
interface Client {
  id: string;
  name: string;
}

interface Therapist {
  id: string;
  name: string;
}

interface Payment {
  status: "paid" | "pending" | "refunded";
  amount: number;
}

interface Session {
  id: string;
  client: Client;
  therapist: Therapist;
  date: string;
  duration: number;
  status: "completed" | "scheduled" | "cancelled";
  type: string;
  notes: string;
  payment: Payment;
}

// Mock data for sessions
const sessions: Session[] = [
  {
    id: "SES-2001",
    client: {
      id: "CL-1001",
      name: "Alice Johnson",
    },
    therapist: {
      id: "TH-001",
      name: "Dr. Sarah Williams",
    },
    date: "2023-06-05T10:00:00",
    duration: 60,
    status: "completed",
    type: "Individual",
    notes: "Client showed progress in managing anxiety. Discussed new coping strategies.",
    payment: {
      status: "paid",
      amount: 120.0,
    },
  },
  {
    id: "SES-2002",
    client: {
      id: "CL-1002",
      name: "Bob Smith",
    },
    therapist: {
      id: "TH-002",
      name: "Dr. Michael Brown",
    },
    date: "2023-06-03T14:00:00",
    duration: 60,
    status: "completed",
    type: "Individual",
    notes: "Focused on depression management techniques. Client is responding well to therapy.",
    payment: {
      status: "paid",
      amount: 120.0,
    },
  },
  {
    id: "SES-2003",
    client: {
      id: "CL-1004",
      name: "David Wilson",
    },
    therapist: {
      id: "TH-003",
      name: "Dr. James Taylor",
    },
    date: "2023-06-10T15:30:00",
    duration: 60,
    status: "scheduled",
    type: "Individual",
    notes: "",
    payment: {
      status: "pending",
      amount: 120.0,
    },
  },
  {
    id: "SES-2004",
    client: {
      id: "CL-1005",
      name: "Eva Martinez",
    },
    therapist: {
      id: "TH-002",
      name: "Dr. Michael Brown",
    },
    date: "2023-06-02T11:00:00",
    duration: 60,
    status: "completed",
    type: "Individual",
    notes: "Discussed grief processing techniques. Client is making slow but steady progress.",
    payment: {
      status: "paid",
      amount: 120.0,
    },
  },
  {
    id: "SES-2005",
    client: {
      id: "CL-1007",
      name: "Grace Lee",
    },
    therapist: {
      id: "TH-001",
      name: "Dr. Sarah Williams",
    },
    date: "2023-06-01T09:00:00",
    duration: 60,
    status: "completed",
    type: "Individual",
    notes: "Initial assessment session. Client is experiencing mild anxiety related to work stress.",
    payment: {
      status: "paid",
      amount: 120.0,
    },
  },
  {
    id: "SES-2006",
    client: {
      id: "CL-1001",
      name: "Alice Johnson",
    },
    therapist: {
      id: "TH-001",
      name: "Dr. Sarah Williams",
    },
    date: "2023-06-12T10:00:00",
    duration: 60,
    status: "scheduled",
    type: "Individual",
    notes: "",
    payment: {
      status: "pending",
      amount: 120.0,
    },
  },
  {
    id: "SES-2007",
    client: {
      id: "CL-1003",
      name: "Carol Davis",
    },
    therapist: {
      id: "TH-001",
      name: "Dr. Sarah Williams",
    },
    date: "2023-06-08T13:00:00",
    duration: 60,
    status: "cancelled",
    type: "Individual",
    notes: "Client cancelled due to illness.",
    payment: {
      status: "refunded",
      amount: 0.0,
    },
  },
]

export default function SessionsPage() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  // Define the type for selectedSession state
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const filteredSessions = sessions.filter((session) => {
    // Filter by status
    if (filterStatus !== "all" && session.status !== filterStatus) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        session.client.name.toLowerCase().includes(query) ||
        session.therapist.name.toLowerCase().includes(query) ||
        session.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session)
    setIsDetailsDialogOpen(true)
  }

  return (
    <div className="h-full flex flex-col">
      <AdminHeader title="Session Management" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Sessions</h2>
          <Button className="bg-[#a98cc8] hover:bg-[#9678b4]">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Session
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sessions..."
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
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Sessions</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("scheduled")}>Scheduled</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("completed")}>Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>Cancelled</DropdownMenuItem>
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
            <CardTitle>Session List</CardTitle>
            <CardDescription>
              {filterStatus === "all" ? "Showing all sessions" : `Showing ${filterStatus} sessions only`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Therapist</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Date & Time
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={session.client.name} />
                          <AvatarFallback>
                            {session.client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{session.client.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{session.therapist.name}</TableCell>
                    <TableCell>{new Date(session.date).toLocaleString()}</TableCell>
                    <TableCell>{session.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          session.status === "completed"
                            ? "default"
                            : session.status === "scheduled"
                              ? "outline"
                              : "destructive"
                        }
                        className={
                          session.status === "completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : session.status === "scheduled"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : ""
                        }
                      >
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          session.payment.status === "paid"
                            ? "default"
                            : session.payment.status === "pending"
                              ? "outline"
                              : "secondary"
                        }
                        className={
                          session.payment.status === "paid"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : session.payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : ""
                        }
                      >
                        {session.payment.status.charAt(0).toUpperCase() + session.payment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewDetails(session)}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View details</span>
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
                            <DropdownMenuItem onClick={() => handleViewDetails(session)}>View details</DropdownMenuItem>
                            <DropdownMenuItem>View client</DropdownMenuItem>
                            <DropdownMenuItem>View therapist</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {session.status === "scheduled" && (
                              <>
                                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                <DropdownMenuItem>Mark as completed</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Cancel session</DropdownMenuItem>
                              </>
                            )}
                            {session.status === "completed" && (
                              <>
                                <DropdownMenuItem>View report</DropdownMenuItem>
                                <DropdownMenuItem>Send summary to client</DropdownMenuItem>
                              </>
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

      {selectedSession && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Session Details</DialogTitle>
              <DialogDescription>
                {selectedSession.id} - {new Date(selectedSession.date).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="notes">Notes & Report</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Client</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={selectedSession.client.name} />
                        <AvatarFallback>
                          {selectedSession.client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{selectedSession.client.name}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Therapist</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={selectedSession.therapist.name} />
                        <AvatarFallback>
                          {selectedSession.therapist.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{selectedSession.therapist.name}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Date & Time</h3>
                    <p>{new Date(selectedSession.date).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Duration</h3>
                    <p>{selectedSession.duration} minutes</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                    <p>{selectedSession.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                    <Badge
                      variant={
                        selectedSession.status === "completed"
                          ? "default"
                          : selectedSession.status === "scheduled"
                            ? "outline"
                            : "destructive"
                      }
                      className={
                        selectedSession.status === "completed"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : selectedSession.status === "scheduled"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : ""
                      }
                    >
                      {selectedSession.status.charAt(0).toUpperCase() + selectedSession.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notes" className="space-y-4 pt-4">
                {selectedSession.status === "completed" ? (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Session Notes</h3>
                    <div className="border rounded-md p-3 bg-muted/50">
                      <p>{selectedSession.notes || "No notes available."}</p>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Session Report</h3>
                      <div className="border rounded-md p-3 bg-muted/50">
                        <p className="text-muted-foreground italic">
                          {selectedSession.notes
                            ? "Detailed report available for download."
                            : "No report available for this session."}
                        </p>
                        {selectedSession.notes && (
                          <Button variant="outline" size="sm" className="mt-2 gap-1">
                            <Download className="h-4 w-4" />
                            Download Report
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">
                      {selectedSession.status === "scheduled"
                        ? "Notes will be available after the session is completed."
                        : "This session was cancelled. No notes available."}
                    </p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="payment" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Status</h3>
                    <Badge
                      variant={
                        selectedSession.payment.status === "paid"
                          ? "default"
                          : selectedSession.payment.status === "pending"
                            ? "outline"
                            : "secondary"
                      }
                      className={
                        selectedSession.payment.status === "paid"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : selectedSession.payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : ""
                      }
                    >
                      {selectedSession.payment.status.charAt(0).toUpperCase() + selectedSession.payment.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Amount</h3>
                    <p>${selectedSession.payment.amount.toFixed(2)}</p>
                  </div>
                </div>
                {selectedSession.payment.status === "paid" && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Details</h3>
                    <div className="border rounded-md p-3 bg-muted/50">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Payment ID</p>
                          <p>PAY-{Math.floor(1000 + Math.random() * 9000)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Date</p>
                          <p>{new Date(selectedSession.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <p>Credit Card (ending in 1234)</p>
                      </div>
                      <div className="mt-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          Download Receipt
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {selectedSession.payment.status === "pending" && (
                  <div className="flex flex-col items-center justify-center gap-4 py-4">
                    <p className="text-muted-foreground">This payment is pending and has not been processed yet.</p>
                    <Button className="bg-[#a98cc8] hover:bg-[#9678b4]">Process Payment</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}









