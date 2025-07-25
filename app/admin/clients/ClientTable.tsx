//Complete table with search, filters, and action dropdowns
import { ChevronDown, Download, Filter, MoreHorizontal, Search, Eye, Edit, UserX } from "lucide-react"
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
import { User, Therapist } from "./types"
import { getTherapistName, formatDate, getInitials, getStatusInfo } from "./utils"

interface ClientTableProps {
  clients: User[]
  therapists: Therapist[]
  filterStatus: string
  setFilterStatus: (status: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  onViewDetails: (client: User) => void
  onEditClient: (client: User) => void
  onDeactivateClient: (client: User) => void
}

export default function ClientTable({
  clients,
  therapists,
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
  onViewDetails,
  onEditClient,
  onDeactivateClient
}: ClientTableProps) {
  const filteredClients = clients.filter((client) => {
    if (filterStatus === "active" && !client.is_active) {
      return false
    }
    if (filterStatus === "inactive" && client.is_active) {
      return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        (client.name?.toLowerCase().includes(query)) ||
        (client.email?.toLowerCase().includes(query)) ||
        client.uid.toLowerCase().includes(query)
      )
    }

    return true
  })

  return (
    <>
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
                <TableHead>Therapist</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Call Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                      {(() => {
                        const statusInfo = getStatusInfo(client.is_active, client.call_request_status)
                        return (
                          <Badge variant={statusInfo.variant} className={statusInfo.className}>
                            {statusInfo.text}
                          </Badge>
                        )
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm">
                          {getTherapistName(client.assigned_tid, therapists)}
                        </span>
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
                          <DropdownMenuItem onClick={() => onViewDetails(client)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditClient(client)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit client
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Assign therapist</DropdownMenuItem>
                          <DropdownMenuItem>Update call status</DropdownMenuItem>
                          {client.is_active && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => onDeactivateClient(client)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            </>
                          )}
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
    </>
  )
}