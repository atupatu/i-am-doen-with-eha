"use client"

import { ArrowUpDown, Calendar, MoreHorizontal, XCircle, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Assignment } from "./types"

interface AssignmentsTableProps {
  assignments: Assignment[]
  filterStatus: string
  loading: boolean
  error: string | null
  onEditAssignment: (assignmentId: string) => void
  onEndAssignment: (assignmentId: string) => void
  onResumeAssignment: (assignmentId: string) => void
  onViewClientDetails: (clientUid: string) => void
  onViewTherapistDetails: (therapistTid: string) => void
}

export default function AssignmentsTable({
  assignments,
  filterStatus,
  loading,
  error,
  onEditAssignment,
  onEndAssignment,
  onResumeAssignment,
  onViewClientDetails,
  onViewTherapistDetails
}: AssignmentsTableProps) {
  const getFilterDescription = () => {
    switch (filterStatus) {
      case "active":
        return "Showing active assignments only"
      case "inactive":
        return "Showing inactive assignments only"
      default:
        return "Showing all assignments"
    }
  }

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle>Client-Therapist Assignments</CardTitle>
        <CardDescription>{getFilterDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4">Loading assignments...</div>
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : (
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
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={`/placeholder.svg?height=32&width=32`} 
                          alt={assignment.client.name} 
                        />
                        <AvatarFallback>
                          {assignment.client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{assignment.client.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {assignment.client.uid}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={`/placeholder.svg?height=32&width=32`} 
                          alt={assignment.therapist.name} 
                        />
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
                        assignment.status === "active" 
                          ? "bg-green-100 text-green-800 hover:bg-green-100" 
                          : ""
                      }
                    >
                      {assignment.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(assignment.start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>N/A</TableCell>
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
                          <DropdownMenuItem onClick={() => onEditAssignment(assignment.id)}>
                            Edit assignment
                          </DropdownMenuItem>
                          <DropdownMenuItem>Schedule session</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View sessions</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewClientDetails(assignment.client.uid)}>
                            View client details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewTherapistDetails(assignment.therapist.tid)}>
                            View therapist details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {assignment.status === 'active' ? (
                            <DropdownMenuItem 
                              className="text-red-600 hover:text-red-700 focus:text-red-700"
                              onClick={() => onEndAssignment(assignment.id)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              End assignment
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              className="text-green-600 hover:text-green-700 focus:text-green-700"
                              onClick={() => onResumeAssignment(assignment.id)}
                            >
                              <PlayCircle className="mr-2 h-4 w-4" />
                              Resume assignment
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {assignments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No assignments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}