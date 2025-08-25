"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, FileText, Phone, Mail, MapPinned } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface ClientProps {
  id: number
  name: string
  image?: string
  age: number
  gender: string
  diagnosis: string
  status: "active" | "inactive" | "new"
  lastSession?: string
  nextSession?: string
  contactInfo: {
    phone: string
    email: string
    address: string
  }
}

interface ClientsListProps {
  clients: ClientProps[]
}

export default function ClientsList({ clients }: ClientsListProps) {
    console.log("Inspecting clients prop:", clients);
  const [selectedClient, setSelectedClient] = useState<ClientProps | null>(null)
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false)

  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No clients found</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {clients.map((client) => (
          <div key={client.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
            <Avatar className="h-12 w-12">
              <AvatarImage src={client.image || "/placeholder.svg?height=48&width=48"} alt={client.name} />
              <AvatarFallback>
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium truncate">{client.name}</h4>
                <Badge
                  variant={client.status === "new" ? "default" : "outline"}
                  className={
                    client.status === "new"
                      ? "bg-[#a98cc8]"
                      : client.status === "active"
                        ? "border-green-500 text-green-500"
                        : "border-gray-500 text-gray-500"
                  }
                >
                  {client.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                <span>
                  {client.age} years, {client.gender}
                </span>
                <span>Diagnosis: {client.diagnosis}</span>
                {client.lastSession && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Last: {formatDate(client.lastSession)}</span>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-[#a98cc8] border-[#a98cc8] hover:bg-[#a98cc8]/10"
              onClick={() => {
                setSelectedClient(client)
                setClientDetailsOpen(true)
              }}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>

      {/* Client Details Dialog */}
      {selectedClient && (
        <Dialog open={clientDetailsOpen} onOpenChange={setClientDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Client Details</DialogTitle>
              <DialogDescription>Detailed information about {selectedClient.name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedClient.image || "/placeholder.svg?height=64&width=64"}
                    alt={selectedClient.name}
                  />
                  <AvatarFallback>
                    {selectedClient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedClient.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={selectedClient.status === "new" ? "default" : "outline"}
                      className={
                        selectedClient.status === "new"
                          ? "bg-[#a98cc8]"
                          : selectedClient.status === "active"
                            ? "border-green-500 text-green-500"
                            : "border-gray-500 text-gray-500"
                      }
                    >
                      {selectedClient.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {selectedClient.age} years, {selectedClient.gender}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">Diagnosis</h4>
                  <p>{selectedClient.diagnosis}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">Sessions</h4>
                  <div className="space-y-1">
                    {selectedClient.lastSession && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Last: {formatDate(selectedClient.lastSession)}</span>
                      </div>
                    )}
                    {selectedClient.nextSession && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-[#a98cc8]" />
                        <span>Next: {formatDate(selectedClient.nextSession)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{selectedClient.contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{selectedClient.contactInfo.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPinned className="h-4 w-4 text-gray-400 mt-1" />
                    <span>{selectedClient.contactInfo.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <a href={`/therapist/clients/${selectedClient.id}/reports`}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Reports
                  </a>
                </Button>
                <Button className="bg-[#a98cc8] hover:bg-[#9678b4]" asChild>
                  <a href={`/therapist/clients/${selectedClient.id}`}>Full Profile</a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
