"use client"

import { useState, useEffect } from "react"
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

interface Session {
  id: string;
  scheduled_date: string;
  start_time: string;
  duration: number;
  status: "completed" | "scheduled" | "cancelled";
  notes: string;
  users: {
    uid: string;
    name: string;
    email: string;
  };
  therapists: {
    tid: string;
    name: string;
    email: string;
  };
}

export default function SessionsPage() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/sessions')
        const data = await response.json()
        if (response.ok) {
          setSessions(data.sessions)
        } else {
          console.error('Failed to fetch sessions:', data.error)
        }
      } catch (error) {
        console.error('Error fetching sessions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const filteredSessions = sessions.filter((session) => {
    // Filter by status
    if (filterStatus !== "all" && session.status !== filterStatus) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        session.users.name.toLowerCase().includes(query) ||
        session.therapists.name.toLowerCase().includes(query) ||
        session.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session)
    setIsDetailsDialogOpen(true)
  }

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`)
    return date.toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <AdminHeader title="Session Management" />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <AdminHeader title="Session Management" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Sessions</h2>
          {/* <Button className="bg-[#a98cc8] hover:bg-[#9678b4]">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Session
          </Button> */}
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
                  <TableHead>Status</TableHead>
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
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={session.users.name} />
                          <AvatarFallback>
                            {session.users.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{session.users.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{session.therapists.name}</TableCell>
                    <TableCell>{formatDateTime(session.scheduled_date, session.start_time)}</TableCell>
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
                {selectedSession.id} - {new Date(selectedSession.scheduled_date).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Client</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={selectedSession.users.name} />
                        <AvatarFallback>
                          {selectedSession.users.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{selectedSession.users.name}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Therapist</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={selectedSession.therapists.name} />
                        <AvatarFallback>
                          {selectedSession.therapists.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{selectedSession.therapists.name}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Date & Time</h3>
                    <p>{formatDateTime(selectedSession.scheduled_date, selectedSession.start_time)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Duration</h3>
                    <p>{selectedSession.duration} minutes</p>
                  </div>
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
              </TabsContent>
              <TabsContent value="notes" className="space-y-4 pt-4">
                {selectedSession.status === "completed" ? (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Session Notes</h3>
                    <div className="border rounded-md p-3 bg-muted/50">
                      <p>{selectedSession.notes || "No notes available."}</p>
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
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}