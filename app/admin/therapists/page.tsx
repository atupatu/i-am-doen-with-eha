"use client"

import { useState } from "react"
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

// Mock data for therapists
const therapists = [
  {
    id: "TH-001",
    name: "Dr. Sarah Williams",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    specialty: "Cognitive Behavioral Therapy",
    clients: 15,
    status: "active",
    availability: "Mon, Wed, Fri",
    joinedDate: "2022-01-15",
    earnings: "$4,500.00",
  },
  {
    id: "TH-002",
    name: "Dr. Michael Brown",
    email: "michael@example.com",
    phone: "+1 (555) 234-5678",
    specialty: "Psychodynamic Therapy",
    clients: 12,
    status: "active",
    availability: "Tue, Thu, Sat",
    joinedDate: "2022-02-20",
    earnings: "$3,600.00",
  },
  {
    id: "TH-003",
    name: "Dr. James Taylor",
    email: "james@example.com",
    phone: "+1 (555) 345-6789",
    specialty: "Mindfulness-Based Therapy",
    clients: 10,
    status: "active",
    availability: "Mon, Tue, Wed, Thu",
    joinedDate: "2022-03-10",
    earnings: "$3,000.00",
  },
  {
    id: "TH-004",
    name: "Dr. Emily Johnson",
    email: "emily@example.com",
    phone: "+1 (555) 456-7890",
    specialty: "Geriatric Counseling",
    clients: 8,
    status: "inactive",
    availability: "Wed, Fri",
    joinedDate: "2022-04-05",
    earnings: "$2,400.00",
  },
  {
    id: "TH-005",
    name: "Dr. Robert Davis",
    email: "robert@example.com",
    phone: "+1 (555) 567-8901",
    specialty: "Trauma-Focused Therapy",
    clients: 14,
    status: "active",
    availability: "Mon, Wed, Fri, Sat",
    joinedDate: "2022-05-15",
    earnings: "$4,200.00",
  },
]

export default function TherapistsPage() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

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
        therapist.specialty.toLowerCase().includes(query) ||
        therapist.id.toLowerCase().includes(query)
      )
    }

    return true
  })

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
                  <Input id="name" placeholder="Dr. John Doe" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" placeholder="john@example.com" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="specialty" className="text-right">
                    Specialty
                  </Label>
                  <Input id="specialty" placeholder="Cognitive Behavioral Therapy" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="availability" className="text-right">
                    Availability
                  </Label>
                  <Input id="availability" placeholder="Mon, Wed, Fri" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bio" className="text-right">
                    Bio
                  </Label>
                  <Textarea id="bio" placeholder="Professional background and experience..." className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#a98cc8] hover:bg-[#9678b4]" onClick={() => setIsAddDialogOpen(false)}>
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
                {filteredTherapists.map((therapist) => (
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
                        <div>
                          <div className="font-medium">{therapist.name}</div>
                          <div className="text-sm text-muted-foreground">{therapist.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{therapist.specialty}</TableCell>
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
                    <TableCell>{therapist.clients}</TableCell>
                    <TableCell>{therapist.availability}</TableCell>
                    <TableCell>{therapist.earnings}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
