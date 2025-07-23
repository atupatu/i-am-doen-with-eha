"use client"

import { useState, useEffect } from "react"
import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Search,
  UserCog,
} from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

interface Therapist {
  tid: string;
  name: string;
  email: string;
  info: string | null;
  availability_hours: number | null;
  created_at: string;
  user_id: string | null;
  status?: string; // We'll add this based on some logic
  clients?: number; // We'll need to fetch this separately
}

export default function TherapistsPage() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    availability: "",
    bio: ""
  })

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
        
        // Transform the data to match our frontend needs
        const transformedTherapists = data.therapists.map((therapist: Therapist) => ({
          ...therapist,
          id: therapist.tid,
          status: 'active', // You might want to add actual status logic
          clients: 0, // You'll need to fetch this from another endpoint
          specialty: therapist.info || 'Not specified',
          availability: therapist.availability_hours ? `${therapist.availability_hours} hours/week` : 'Not specified',
          earnings: '$0.00' // You'll need to calculate this
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

  const handleAddTherapist = async () => {
    try {
      const response = await fetch('/api/therapists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          info: formData.specialty,
          availability_hours: parseInt(formData.availability) || 0,
          // You'll need to handle user_id appropriately
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add therapist')
      }

      const newTherapist = await response.json()
      
      // Update local state with the new therapist
      setTherapists(prev => [
        ...prev,
        {
          ...newTherapist.data[0],
          id: newTherapist.data[0].tid,
          status: 'active',
          clients: 0,
          specialty: newTherapist.data[0].info || 'Not specified',
          availability: newTherapist.data[0].availability_hours ? 
            `${newTherapist.data[0].availability_hours} hours/week` : 'Not specified',
          earnings: '$0.00'
        }
      ])

      setIsAddDialogOpen(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialty: "",
        availability: "",
        bio: ""
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add therapist')
    }
  }

  const filteredTherapists = therapists.filter((therapist) => {
    // Filter by status
    if (filterStatus !== "all" && therapist.status !== filterStatus) {
      return false
    }

    // Filter by search query
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#a98cc8] hover:bg-[#9678b4]">
                <UserCog className="mr-2 h-4 w-4" />
                Add New Therapist
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Therapist</DialogTitle>
                <DialogDescription>
                  Enter the details of the new therapist. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input 
                    id="name" 
                    placeholder="Dr. John Doe" 
                    className="col-span-3" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    placeholder="john@example.com" 
                    className="col-span-3" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input 
                    id="phone" 
                    placeholder="+1 (555) 123-4567" 
                    className="col-span-3" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="specialty" className="text-right">
                    Specialty
                  </Label>
                  <Input 
                    id="specialty" 
                    placeholder="Cognitive Behavioral Therapy" 
                    className="col-span-3" 
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="availability" className="text-right">
                    Availability
                  </Label>
                  <Input 
                    id="availability" 
                    placeholder="Mon, Wed, Fri" 
                    className="col-span-3" 
                    value={formData.availability}
                    onChange={(e) => setFormData({...formData, availability: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bio" className="text-right">
                    Bio
                  </Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Professional background and experience..." 
                    className="col-span-3" 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#a98cc8] hover:bg-[#9678b4]" onClick={handleAddTherapist}>
                  Save Therapist
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
                  <TableHead>
                    <div className="flex items-center">
                      Clients
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Earnings
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
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
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Calendar className="h-4 w-4" />
                            <span className="sr-only">View schedule</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
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
                              <DropdownMenuItem>Edit therapist</DropdownMenuItem>
                              <DropdownMenuItem>View clients</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Edit schedule</DropdownMenuItem>
                              <DropdownMenuItem>View earnings</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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