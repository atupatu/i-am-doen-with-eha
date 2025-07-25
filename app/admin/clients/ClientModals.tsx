//All three modals (Add/Edit/View) plus notification
import { X, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Therapist, FormData, Notification } from "./types"
import { getTherapistName, formatDate, getInitials, getStatusInfo } from "./utils"
import ClientForm from "./ClientForm"

interface ClientModalsProps {
  // Modal states
  showAddModal: boolean
  setShowAddModal: (show: boolean) => void
  showEditModal: boolean
  setShowEditModal: (show: boolean) => void
  showDetailsModal: boolean
  setShowDetailsModal: (show: boolean) => void
  
  // Data
  selectedClient: User | null
  setSelectedClient: (client: User | null) => void
  therapists: Therapist[]
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  
  // Actions
  handleAddClient: () => void
  handleEditClient: () => void
  openEditModal: (client: User) => void
  resetForm: () => void
  
  // Notification
  notification: Notification | null
  closeNotification: () => void
}

export default function ClientModals({
  showAddModal,
  setShowAddModal,
  showEditModal,
  setShowEditModal,
  showDetailsModal,
  setShowDetailsModal,
  selectedClient,
  setSelectedClient,
  therapists,
  formData,
  setFormData,
  handleAddClient,
  handleEditClient,
  openEditModal,
  resetForm,
  notification,
  closeNotification
}: ClientModalsProps) {
  return (
    <>
      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add New Client</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <ClientForm
                formData={formData}
                setFormData={setFormData}
                therapists={therapists}
                onSubmit={handleAddClient}
                onCancel={() => setShowAddModal(false)}
                submitLabel="Create Client"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Client</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <ClientForm
                formData={formData}
                setFormData={setFormData}
                therapists={therapists}
                onSubmit={handleEditClient}
                onCancel={() => setShowEditModal(false)}
                isEdit={true}
                submitLabel="Update Client"
              />
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Client Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowDetailsModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/placeholder.svg?height=64&width=64`} alt={selectedClient.name || 'User'} />
                    <AvatarFallback className="text-lg">
                      {getInitials(selectedClient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-xl font-semibold">{selectedClient.name || 'No name provided'}</h4>
                    <p className="text-gray-600">{selectedClient.email || 'No email provided'}</p>
                    {(() => {
                      const statusInfo = getStatusInfo(selectedClient.is_active, selectedClient.call_request_status)
                      return (
                        <Badge variant={statusInfo.variant} className={statusInfo.className}>
                          {statusInfo.text}
                        </Badge>
                      )
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <Label className="text-sm font-medium text-gray-500">Assigned Therapist</Label>
                    <p className="text-sm mt-1">{getTherapistName(selectedClient.assigned_tid, therapists)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <Label className="text-sm font-medium text-gray-500">Call Request Status</Label>
                    <p className="text-sm mt-1 capitalize">{selectedClient.call_request_status || 'none'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <Label className="text-sm font-medium text-gray-500">Account Status</Label>
                    <p className="text-sm mt-1">{selectedClient.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <Label className="text-sm font-medium text-gray-500">Created Date</Label>
                    <p className="text-sm mt-1">{formatDate(selectedClient.created_at)}</p>
                  </div>
                </div>

                {selectedClient.form_response && (
                  <div className="bg-white p-4 rounded-lg border">
                    <Label className="text-sm font-medium text-gray-500 mb-2 block">Form Response</Label>
                    <div className="bg-gray-50 p-3 rounded text-xs">
                      <pre className="whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(selectedClient.form_response, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowDetailsModal(false)
                  openEditModal(selectedClient)
                }} className="bg-[#a98cc8] hover:bg-[#9678b4]">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Client
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
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
    </>
  )
}