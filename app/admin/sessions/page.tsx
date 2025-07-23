"use client"

import { useState, useEffect } from "react"
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

// Type definitions based on your schema
interface User {
  uid: string
  name: string | null
  email: string | null
  phone: string | null
  form_response: any | null
  assigned_tid: string | null
  created_at: string | null
  is_active: boolean
  call_request_status: 'pending' | 'completed' | 'none' | null
}

interface Assignment {
  id: string
  client_uid: string
  therapist_tid: string
  created_at: string
  client: {
    uid: string
    name: string | null
    email: string | null
  }
  therapist: {
    tid: string
    name: string
  }
}

// Enhanced client type with assignment and session data
interface EnhancedClient extends User {
  assignedTherapist?: string
  sessionCount?: number
}

export default function ClientsPage() {
  const [clients, setClients] = useState<EnhancedClient[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch clients, assignments, and session counts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch users and assignments in parallel
        const [usersResponse, assignmentsResponse] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/assignments')
        ])
        
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch clients')
        }
        
        if (!assignmentsResponse.ok) {
          throw new Error('Failed to fetch assignments')
        }
        
        const usersData = await usersResponse.json()
        const assignmentsData = await assignmentsResponse.json()
        
        if (usersData.error) {
          throw new Error(usersData.error)
        }
        
        if (assignmentsData.error) {
          throw new Error(assignmentsData.error)
        }
        
        const users = usersData.users || []
        const assignments = assignmentsData.assignments || []
        
        setAssignments(assignments)
        
        // Enhance users with therapist names and session counts
        const enhancedClients = await Promise.all(
          users.map(async (user: User) => {
            // Find current assignment for this client
            const currentAssignment = assignments.find(
              (assignment: Assignment) => assignment.client_uid === user.uid
            )
            
            // Get session count for this client
            let sessionCount = 0
            try {
              const sessionResponse = await fetch(`/api/sessions/client/${user.uid}?count=true`)
              if (sessionResponse.ok) {
                const sessionData = await sessionResponse.json()
                sessionCount = sessionData.count || 0
              }
            } catch (err) {
              console.warn(`Failed to fetch session count for client ${user.uid}:`, err)
            }
            
            return {
              ...user,
              assignedTherapist: currentAssignment?.therapist?.name || 'Unassigned',
              sessionCount
            } as EnhancedClient
          })
        )
        
        setClients(enhancedClients)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredClients = clients.filter((client) => {
    // Filter by status (using is_active field)
    if (filterStatus === "active" && !client.is_active) {
      return false
    }
    if (filterStatus === "inactive" && client.is_active) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        (client.name?.toLowerCase().includes(query)) ||
        (client.email?.toLowerCase().includes(query)) ||
        client.uid.toLowerCase().includes(query) ||
        (client.assignedTherapist?.toLowerCase().includes(query))
      )
    }

    return true
  })

  // Helper function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  // Helper function to get initials
  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  // Helper function to get status badge
  const getStatusBadge = (isActive: boolean, callStatus: string | null) => {
    if (!isActive) {
      return (
        <Badge variant="secondary">
          Inactive
        </Badge>
      )
    }
    
    if (callStatus === 'pending') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Call Pending
        </Badge>
      )
    }

    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <AdminHeader title="Client Management" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a98cc8] mb-4 mx-auto"></div>
            <p>Loading client data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <AdminHeader title="Client Management" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
                placeholder="Search clients, therapists..."
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
              Showing {filteredClients.length} of {clients.length} clients
              {filterStatus !== "all" && ` (${filterStatus} only)`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Client ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Therapist</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Sessions
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Call Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No clients found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.uid}>
                      <TableCell className="font-mono text-xs">
                        {client.uid.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={client.name || 'User'} />
                            <AvatarFallback>
                              {getInitials(client.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{client.name || 'No name provided'}</div>
                            <div className="text-sm text-muted-foreground">{client.email || 'No email provided'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(client.is_active, client.call_request_status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            client.assignedTherapist === 'Unassigned' ? 'bg-gray-400' : 'bg-blue-500'
                          }`}></div>
                          <span className="text-sm">
                            {client.assignedTherapist}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{client.sessionCount || 0}</span>
                          <span className="text-xs text-muted-foreground">sessions</span>
                        </div>
                      </TableCell>
                      <TableCell>{client.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            client.call_request_status === 'pending' ? 'default' :
                            client.call_request_status === 'completed' ? 'secondary' : 
                            'outline'
                          }
                        >
                          {client.call_request_status || 'none'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(client.created_at)}</TableCell>
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
                            <DropdownMenuItem>View form response</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Assign/Change therapist</DropdownMenuItem>
                            <DropdownMenuItem>Update call status</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              {client.is_active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}