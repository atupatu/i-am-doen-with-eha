"use client"

import { useState, useEffect } from "react"
import { UserPlus, X } from "lucide-react"
import { AdminHeader } from "@/components/admin/header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import AssignmentsTable from "./AssignmentsTable"
import AssignmentFilters from "./AssignmentFilters"
import CreateAssignmentDialog, { EditAssignmentDialog } from "./AssignmentDialogs"
import { Assignment, AvailableClient, AvailableTherapist } from "./types"

export default function AssignmentsPage() {
  // Filter and search states
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Dialog states
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  // Form states
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedTherapist, setSelectedTherapist] = useState("")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [editStatus, setEditStatus] = useState("")
  
  // Data states
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [availableClients, setAvailableClients] = useState<AvailableClient[]>([])
  const [availableTherapists, setAvailableTherapists] = useState<AvailableTherapist[]>([])
  
  // Loading states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Notification box states
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    details?: string;
  } | null>(null)

  // Show notification box
  const showNotification = (type: 'success' | 'error' | 'info', message: string, details?: string) => {
    setNotification({ type, message, details })
  }

  // Close notification box
  const closeNotification = () => {
    setNotification(null)
  }

  // Fetch assignments from API
  useEffect(() => {
    async function fetchAssignments() {
      try {
        setLoading(true)
        const response = await fetch('/api/assignments')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch assignments')
        }

        setAssignments(data.assignments || [])
        setError(null)
      } catch (err) {
        setError('Error fetching assignments. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  // Fetch available clients and therapists when either dialog opens
  useEffect(() => {
    async function fetchAvailableOptions() {
      if (!isAssignDialogOpen && !isEditDialogOpen) return

      try {
        const [clientsResponse, therapistsResponse] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/therapists')
        ])

        const clientsData = await clientsResponse.json()
        const therapistsData = await therapistsResponse.json()

        if (clientsResponse.ok) {
          setAvailableClients(clientsData.users || [])
        }
        if (therapistsResponse.ok) {
          setAvailableTherapists(therapistsData.therapists || [])
        }
      } catch (err) {
        console.error('Error fetching available options:', err)
      }
    }

    fetchAvailableOptions()
  }, [isAssignDialogOpen, isEditDialogOpen])

  const handleCreateAssignment = async () => {
    if (!selectedClient || !selectedTherapist) {
      showNotification('error', 'Please select both a client and therapist')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_uid: selectedClient,
          therapist_tid: selectedTherapist,
          start_date: startDate,
          notes: notes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create assignment')
      }

      setAssignments(prev => [data.assignment, ...prev])
      resetCreateForm()
      showNotification('success', 'Assignment created successfully!')
    } catch (err: any) {
      showNotification('error', 'Error creating assignment', err.message)
    } finally {
      setIsCreating(false)
    }
  }

  const resetCreateForm = () => {
    setIsAssignDialogOpen(false)
    setSelectedClient("")
    setSelectedTherapist("")
    setStartDate(new Date().toISOString().split("T")[0])
    setNotes("")
  }

  const handleEditAssignment = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId)
    if (assignment) {
      setEditingAssignment(assignment)
      setSelectedClient(assignment.client.uid)
      setSelectedTherapist(assignment.therapist.tid)
      setStartDate(assignment.start_date)
      setNotes(assignment.notes || "")
      setEditStatus(assignment.status)
      setIsEditDialogOpen(true)
    }
  }

  const handleUpdateAssignment = async () => {
    if (!editingAssignment || !selectedClient || !selectedTherapist) {
      showNotification('error', 'Please select both a client and therapist')
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/assignments/${editingAssignment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_uid: selectedClient,
          therapist_tid: selectedTherapist,
          start_date: startDate,
          notes: notes || null,
          status: editStatus,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update assignment')
      }

      setAssignments(prev => prev.map(assignment => 
        assignment.id === editingAssignment.id 
          ? data.assignment
          : assignment
      ))
      
      resetEditForm()
      showNotification('success', 'Assignment updated successfully!')
    } catch (err: any) {
      showNotification('error', 'Error updating assignment', err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const resetEditForm = () => {
    setIsEditDialogOpen(false)
    setEditingAssignment(null)
    setSelectedClient("")
    setSelectedTherapist("")
    setStartDate(new Date().toISOString().split("T")[0])
    setNotes("")
    setEditStatus("")
  }

  const handleViewClientDetails = async (clientUid: string) => {
    try {
      const response = await fetch(`/api/users/${clientUid}`)
      const data = await response.json()
      
      if (response.ok) {
        console.log('Client details:', data.data)
        showNotification('info', 'Client Details', `Name: ${data.data.name}\nEmail: ${data.data.email}\nUID: ${data.data.uid}`)
      } else {
        throw new Error(data.error || 'Failed to fetch client details')
      }
    } catch (err: any) {
      showNotification('error', 'Error fetching client details', err.message)
    }
  }

  const handleViewTherapistDetails = async (therapistTid: string) => {
    try {
      const response = await fetch(`/api/therapists/${therapistTid}`)
      const data = await response.json()
      
      if (response.ok) {
        console.log('Therapist details:', data.therapist)
        showNotification('info', 'Therapist Details', `Name: ${data.therapist.name}\nTID: ${data.therapist.tid}`)
      } else {
        throw new Error(data.error || 'Failed to fetch therapist details')
      }
    } catch (err: any) {
      showNotification('error', 'Error fetching therapist details', err.message)
    }
  }

  const handleEndAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to end this assignment?')) {
      return
    }

    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'inactive',
          end_date: new Date().toISOString().split('T')[0]
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to end assignment')
      }

      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: 'inactive' }
          : assignment
      ))
      
      showNotification('success', 'Assignment ended successfully!')
    } catch (err: any) {
      showNotification('error', 'Error ending assignment', err.message)
    }
  }

  const handleResumeAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to resume this assignment?')) {
      return
    }

    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'active',
          end_date: null
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resume assignment')
      }

      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: 'active' }
          : assignment
      ))
      
      showNotification('success', 'Assignment resumed successfully!')
    } catch (err: any) {
      showNotification('error', 'Error resuming assignment', err.message)
    }
  }

  const filteredAssignments = assignments.filter((assignment) => {
    // Filter by status
    if (filterStatus !== "all" && assignment.status !== filterStatus) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        assignment.client.name.toLowerCase().includes(query) ||
        assignment.therapist.name.toLowerCase().includes(query) ||
        assignment.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  return (
    <div className="h-full flex flex-col">
      <AdminHeader title="Client-Therapist Assignments" />
      
      {/* Notification Box */}
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{notification.message}</h4>
                {notification.details && (
                  <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{notification.details}</p>
                )}
              </div>
              <button
                onClick={closeNotification}
                className="ml-3 flex-shrink-0 p-1 hover:bg-purple-100 rounded text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#a98cc8] hover:bg-[#9678b4]">
                <UserPlus className="mr-2 h-4 w-4" />
                New Assignment
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        <AssignmentFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        <AssignmentsTable
          assignments={filteredAssignments}
          filterStatus={filterStatus}
          loading={loading}
          error={error}
          onEditAssignment={handleEditAssignment}
          onEndAssignment={handleEndAssignment}
          onResumeAssignment={handleResumeAssignment}
          onViewClientDetails={handleViewClientDetails}
          onViewTherapistDetails={handleViewTherapistDetails}
        />

        <CreateAssignmentDialog
          isOpen={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          selectedClient={selectedClient}
          onClientChange={setSelectedClient}
          selectedTherapist={selectedTherapist}
          onTherapistChange={setSelectedTherapist}
          startDate={startDate}
          onStartDateChange={setStartDate}
          notes={notes}
          onNotesChange={setNotes}
          availableClients={availableClients}
          availableTherapists={availableTherapists}
          isCreating={isCreating}
          onSubmit={handleCreateAssignment}
          onCancel={resetCreateForm}
        />

        <EditAssignmentDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          editingAssignment={editingAssignment}
          selectedClient={selectedClient}
          onClientChange={setSelectedClient}
          selectedTherapist={selectedTherapist}
          onTherapistChange={setSelectedTherapist}
          startDate={startDate}
          onStartDateChange={setStartDate}
          notes={notes}
          onNotesChange={setNotes}
          editStatus={editStatus}
          onStatusChange={setEditStatus}
          availableClients={availableClients}
          availableTherapists={availableTherapists}
          isUpdating={isUpdating}
          onSubmit={handleUpdateAssignment}
          onCancel={resetEditForm}
        />
      </div>
    </div>
  )
}