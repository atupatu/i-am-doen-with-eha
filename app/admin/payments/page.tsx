"use client"

import { useState } from "react"
import { ArrowUpDown, Check, ChevronDown, CreditCard, Download, Filter, MoreHorizontal, Search, X } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for payments
const payments = [
  {
    id: "PAY-1001",
    client: {
      id: "CL-1001",
      name: "Alice Johnson",
    },
    therapist: {
      id: "TH-001",
      name: "Dr. Sarah Williams",
    },
    amount: 120.0,
    status: "paid",
    date: "2023-06-05",
    method: "Credit Card",
    sessionId: "SES-2001",
  },
  {
    id: "PAY-1002",
    client: {
      id: "CL-1002",
      name: "Bob Smith",
    },
    therapist: {
      id: "TH-002",
      name: "Dr. Michael Brown",
    },
    amount: 120.0,
    status: "paid",
    date: "2023-06-03",
    method: "PayPal",
    sessionId: "SES-2002",
  },
  {
    id: "PAY-1003",
    client: {
      id: "CL-1004",
      name: "David Wilson",
    },
    therapist: {
      id: "TH-003",
      name: "Dr. James Taylor",
    },
    amount: 120.0,
    status: "pending",
    date: "2023-06-10",
    method: "Credit Card",
    sessionId: "SES-2003",
  },
  {
    id: "PAY-1004",
    client: {
      id: "CL-1005",
      name: "Eva Martinez",
    },
    therapist: {
      id: "TH-002",
      name: "Dr. Michael Brown",
    },
    amount: 120.0,
    status: "paid",
    date: "2023-06-02",
    method: "Bank Transfer",
    sessionId: "SES-2004",
  },
  {
    id: "PAY-1005",
    client: {
      id: "CL-1007",
      name: "Grace Lee",
    },
    therapist: {
      id: "TH-001",
      name: "Dr. Sarah Williams",
    },
    amount: 120.0,
    status: "failed",
    date: "2023-06-01",
    method: "Credit Card",
    sessionId: "SES-2005",
  },
  {
    id: "PAY-1006",
    client: {
      id: "CL-1001",
      name: "Alice Johnson",
    },
    therapist: {
      id: "TH-001",
      name: "Dr. Sarah Williams",
    },
    amount: 120.0,
    status: "pending",
    date: "2023-06-12",
    method: "Credit Card",
    sessionId: "SES-2006",
  },
]

// Mock data for therapist earnings
const therapistEarnings = [
  {
    id: "TH-001",
    name: "Dr. Sarah Williams",
    sessions: 25,
    earnings: 3000.0,
    paid: 2400.0,
    pending: 600.0,
  },
  {
    id: "TH-002",
    name: "Dr. Michael Brown",
    sessions: 20,
    earnings: 2400.0,
    paid: 2160.0,
    pending: 240.0,
  },
  {
    id: "TH-003",
    name: "Dr. James Taylor",
    sessions: 18,
    earnings: 2160.0,
    paid: 1920.0,
    pending: 240.0,
  },
  {
    id: "TH-005",
    name: "Dr. Robert Davis",
    sessions: 22,
    earnings: 2640.0,
    paid: 2400.0,
    pending: 240.0,
  },
]

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("payments")

  const filteredPayments = payments.filter((payment) => {
    // Filter by status
    if (filterStatus !== "all" && payment.status !== filterStatus) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        payment.client.name.toLowerCase().includes(query) ||
        payment.therapist.name.toLowerCase().includes(query) ||
        payment.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  return (
    <div className="h-full flex flex-col">
      <AdminHeader title="Payment Management" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <Button className="bg-[#a98cc8] hover:bg-[#9678b4]">
            <CreditCard className="mr-2 h-4 w-4" />
            Process Payment
          </Button>
        </div>

        <Tabs defaultValue="payments" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payments">Client Payments</TabsTrigger>
            <TabsTrigger value="earnings">Therapist Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex w-full md:w-auto items-center gap-2">
                <div className="relative w-full md:w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search payments..."
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
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Payments</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("paid")}>Paid</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("pending")}>Pending</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("failed")}>Failed</DropdownMenuItem>
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
                <CardTitle>Payment Transactions</CardTitle>
                <CardDescription>
                  {filterStatus === "all" ? "Showing all payments" : `Showing ${filterStatus} payments only`}
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
                          Amount
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={payment.client.name} />
                              <AvatarFallback>
                                {payment.client.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{payment.client.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{payment.therapist.name}</TableCell>
                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === "paid"
                                ? "default"
                                : payment.status === "pending"
                                  ? "outline"
                                  : "destructive"
                            }
                            className={
                              payment.status === "paid"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : ""
                            }
                          >
                            {payment.status === "paid" ? (
                              <>
                                <Check className="mr-1 h-3 w-3" /> Paid
                              </>
                            ) : payment.status === "pending" ? (
                              "Pending"
                            ) : (
                              <>
                                <X className="mr-1 h-3 w-3" /> Failed
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                        <TableCell>{payment.method}</TableCell>
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
                              <DropdownMenuItem>View session</DropdownMenuItem>
                              <DropdownMenuItem>View client</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {payment.status === "pending" && (
                                <>
                                  <DropdownMenuItem>Process payment</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Cancel payment</DropdownMenuItem>
                                </>
                              )}
                              {payment.status === "failed" && <DropdownMenuItem>Retry payment</DropdownMenuItem>}
                              {payment.status === "paid" && <DropdownMenuItem>Send receipt</DropdownMenuItem>}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex w-full md:w-auto items-center gap-2">
                <div className="relative w-full md:w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search therapists..." className="pl-8" />
                </div>
                <Select defaultValue="current">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Month</SelectItem>
                    <SelectItem value="previous">Previous Month</SelectItem>
                    <SelectItem value="quarter">Current Quarter</SelectItem>
                    <SelectItem value="year">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle>Therapist Earnings</CardTitle>
                <CardDescription>Earnings for the current month</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Therapist</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Sessions
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Total Earnings
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Pending Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {therapistEarnings.map((therapist) => (
                      <TableRow key={therapist.id}>
                        <TableCell className="font-medium">{therapist.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={therapist.name} />
                              <AvatarFallback>
                                {therapist.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{therapist.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{therapist.sessions}</TableCell>
                        <TableCell>${therapist.earnings.toFixed(2)}</TableCell>
                        <TableCell>${therapist.paid.toFixed(2)}</TableCell>
                        <TableCell>${therapist.pending.toFixed(2)}</TableCell>
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
                              <DropdownMenuItem>View sessions</DropdownMenuItem>
                              <DropdownMenuItem>View payment history</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Process payment</DropdownMenuItem>
                              <DropdownMenuItem>Generate report</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
