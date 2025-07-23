"use client"

import { useState, useEffect } from "react"
import {ArrowUpDown, 
  Calendar, 
  ChevronDown,  // Make sure this is included
  Download, 
  Edit, 
  Filter, 
  MoreHorizontal, 
  Search, 
  UserCog  } from "lucide-react"
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
} from"@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

//api integration for post method:
import { AddTherapistDialog } from "@/components/therapist/AddTherapistDialog"
//api integration for patch method:
import { TherapistActions } from "@/components/therapist/TherapistActions"

interface Therapist {
  tid: string;
  name: string;
  email: string;
  info: string | null;
  availability_hours: number | null;
  created_at: string;
  user_id: string | null;
  status?: string;
  clients?: number;
}

export default function TherapistsPage() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch therapists from API
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/therapists')
        if (!response.ok) {
          throw new Error('Failed to fetch therapists')
        }
        const data = await response.json()
        
        const transformedTherapists = data.therapists.map((therapist: Therapist) => ({
          ...therapist,
          status: 'active',
          clients: 0,
          earnings: '$0.00'
        }))
        
        setTherapists(transformedTherapists)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTherapists()
  }, [])

  const handleTherapistAdded = (newTherapist: Therapist) => {
    setTherapists(prev => [
      ...prev,
      {
        ...newTherapist,
        status: 'active',
        clients: 0,
        earnings: '$0.00'
      }
    ])
  }

  const handleTherapistUpdated = (updatedTherapist: Therapist | null | undefined) => {
    if (!updatedTherapist || !updatedTherapist.tid) {
      console.warn("Invalid therapist object passed to handleTherapistUpdated:", updatedTherapist);
      return;
    }
  
    setTherapists(prev => 
      prev.map(t => 
        t.tid === updatedTherapist.tid ? { ...t, ...updatedTherapist } : t
      )
    )
  }
  

  const handleTherapistDeleted = (tid: string) => {
    setTherapists(prev => prev.filter(t => t.tid !== tid))
  }

  const filteredTherapists = therapists.filter((therapist) => {
    if (filterStatus !== "all" && therapist.status !== filterStatus) {
      return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        therapist.name.toLowerCase().includes(query) ||
        therapist.email.toLowerCase().includes(query) ||
        (therapist.info && therapist.info.toLowerCase().includes(query)) ||
        therapist.tid.toLowerCase().includes(query)
      )
    }

    return true
  })

  if (loading) {
    return <div className="p-8">Loading therapists...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>
  }

  return (
    <div className="h-full flex flex-col">
      <AdminHeader title="Therapist Management" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Therapists</h2>
          <AddTherapistDialog onTherapistAdded={handleTherapistAdded} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search therapists..."
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
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Therapists</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active Therapists</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>Inactive Therapists</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle>Therapist List</CardTitle>
            <CardDescription>
              {filterStatus === "all"
                ? "Showing all therapists"
                : filterStatus === "active"
                  ? "Showing active therapists only"
                  : "Showing inactive therapists only"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Clients</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTherapists.length > 0 ? (
                  filteredTherapists.map((therapist) => (
                    <TableRow key={therapist.tid}>
                      <TableCell className="font-medium">{therapist.tid.substring(0, 6)}...</TableCell>
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
                          <div>
                            <div className="font-medium">{therapist.name}</div>
                            <div className="text-sm text-muted-foreground">{therapist.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{therapist.info || 'Not specified'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={therapist.status === "active" ? "default" : "secondary"}
                          className={
                            therapist.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                          }
                        >
                          {therapist.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{therapist.clients || 0}</TableCell>
                      <TableCell>
                        {therapist.availability_hours ? `${therapist.availability_hours} hours/week` : 'Not specified'}
                      </TableCell>
                      <TableCell>{therapist.earnings || '$0.00'}</TableCell>
                      <TableCell className="text-right">
                        <TherapistActions 
                          therapist={therapist}
                          onTherapistUpdated={handleTherapistUpdated}
                          onTherapistDeleted={handleTherapistDeleted}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No therapists found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}