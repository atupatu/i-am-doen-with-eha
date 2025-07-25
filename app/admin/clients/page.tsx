// //Main container with state management and API calls
// "use client"

// import { useState, useEffect } from "react"
// import { UserPlus } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { User, Therapist, Notification, FormData } from "./types"
// import ClientTable from "./ClientTable"
// import ClientModals from "./ClientModals"

// export default function ClientsPage() {
//   const [clients, setClients] = useState<User[]>([])
//   const [therapists, setTherapists] = useState<Therapist[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [filterStatus, setFilterStatus] = useState("all")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [notification, setNotification] = useState<Notification | null>(null)
  
//   // Modal states
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [showDetailsModal, setShowDetailsModal] = useState(false)
//   const [selectedClient, setSelectedClient] = useState<User | null>(null)
  
//   // Form state - removed uid field
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     email: '',
//     phone: '',
//     assigned_tid: '',
//     is_active: true,
//     call_request_status: 'none',
//     form_response: ''
//   })

//   // Fetch clients and therapists from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
        
//         const [usersResponse, therapistsResponse] = await Promise.all([
//           fetch('/api/users'),
//           fetch('/api/therapists')
//         ])
        
//         if (!usersResponse.ok) {
//           throw new Error('Failed to fetch clients')
//         }
        
//         if (!therapistsResponse.ok) {
//           throw new Error('Failed to fetch therapists')
//         }
        
//         const usersData = await usersResponse.json()
//         const therapistsData = await therapistsResponse.json()
        
//         if (usersData.error) {
//           throw new Error(usersData.error)
//         }
        
//         if (therapistsData.error) {
//           throw new Error(therapistsData.error)
//         }
        
//         setClients(usersData.users || [])
//         setTherapists(therapistsData.therapists || therapistsData || [])
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   const showNotification = (message: string, details?: string) => {
//     setNotification({ message, details })
//   }

//   const closeNotification = () => {
//     setNotification(null)
//   }

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       email: '',
//       phone: '',
//       assigned_tid: '',
//       is_active: true,
//       call_request_status: 'none',
//       form_response: ''
//     })
//   }

//   const handleDeactivateClient = async (client: User) => {
//     try {
//       const response = await fetch(`/api/users/${client.uid}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           is_active: false
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to deactivate client')
//       }

//       setClients(prev => prev.map(c => 
//         c.uid === client.uid 
//           ? { ...c, is_active: false }
//           : c
//       ))
      
//       showNotification('Success', `Client "${client.name}" has been deactivated.`)
      
//     } catch (error) {
//       showNotification('Error', error instanceof Error ? error.message : 'Failed to deactivate client')
//     }
//   }
// const handleAddClient = async () => {
//   try {
//     if (!formData.name || !formData.email) {
//       showNotification('Error', 'Name and Email are required fields.')
//       return
//     }

//     // Parse form_response 
//     let parsedFormResponse = null
//     try {
//       parsedFormResponse = formData.form_response ? JSON.parse(formData.form_response) : null
//     } catch (e) {
//       showNotification('Error', 'Invalid JSON in form response field.')
//       return
//     }

//     // Validate assigned_tid if provided
//     let validAssignedTid = null
//     if (formData.assigned_tid && formData.assigned_tid.trim() !== '') {
//       const trimmedTid = formData.assigned_tid.trim()
      
//       // Check if it's a valid UUID format (more strict validation)
//       const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      
//       if (uuidRegex.test(trimmedTid)) {
//         validAssignedTid = trimmedTid
//       } else {
//         showNotification('Error', `Invalid therapist ID format: "${trimmedTid}". Please select a valid therapist from the dropdown.`)
//         return
//       }
//     }

//     const requestBody = {
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone || null,
//       assigned_tid: validAssignedTid, // This will be null or a valid UUID
//       is_active: formData.is_active,
//       call_request_status: formData.call_request_status,
//       form_response: parsedFormResponse ? JSON.stringify(parsedFormResponse) : null
//     }

//     console.log('Sending request with body:', requestBody) // Debug log

//     const response = await fetch('/api/admin/clients', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(requestBody),
//     })

//     const data = await response.json()

//     if (!response.ok) {
//       throw new Error(data.error || 'Failed to create client')
//     }

//     setClients(prev => [...prev, data.user])
//     setShowAddModal(false)
//     resetForm()
//     showNotification('Success', `Client "${formData.name}" has been created successfully.`)

//   } catch (error) {
//     console.error('Error creating client:', error) // Debug log
//     showNotification('Error', error instanceof Error ? error.message : 'Failed to create client')
//   }
// }

//   const handleEditClient = async () => {
//     try {
//       if (!selectedClient || !formData.name || !formData.email) {
//         showNotification('Error', 'Name and Email are required fields.')
//         return
//       }

//       let parsedFormResponse = null
//       try {
//         parsedFormResponse = formData.form_response ? JSON.parse(formData.form_response) : {}
//       } catch (e) {
//         parsedFormResponse = {}
//       }

//       const response = await fetch(`/api/users/${selectedClient.uid}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           assigned_tid: formData.assigned_tid || null,
//           is_active: formData.is_active,
//           call_request_status: formData.call_request_status,
//           form_response: parsedFormResponse
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update client')
//       }

//       setClients(prev => prev.map(client => 
//         client.uid === selectedClient.uid 
//           ? { ...client, ...formData, assigned_tid: formData.assigned_tid || null, form_response: parsedFormResponse }
//           : client
//       ))
      
//       setShowEditModal(false)
//       setSelectedClient(null)
//       resetForm()
//       showNotification('Success', `Client "${formData.name}" has been updated successfully.`)
      
//     } catch (error) {
//       showNotification('Error', error instanceof Error ? error.message : 'Failed to update client')
//     }
//   }

//   const openAddModal = () => {
//     resetForm()
//     setShowAddModal(true)
//   }

//   const openEditModal = (client: User) => {
//     setSelectedClient(client)
//     setFormData({
//       name: client.name || '',
//       email: client.email || '',
//       phone: client.phone || '',
//       assigned_tid: client.assigned_tid || '',
//       is_active: client.is_active,
//       call_request_status: client.call_request_status || 'none',
//       form_response: client.form_response ? JSON.stringify(client.form_response, null, 2) : ''
//     })
//     setShowEditModal(true)
//   }

//   const openDetailsModal = (client: User) => {
//     setSelectedClient(client)
//     setShowDetailsModal(true)
//   }

//   if (loading) {
//     return (
//       <div className="h-full flex flex-col">
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a98cc8] mb-4"></div>
//             <p>Loading clients...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="h-full flex flex-col">
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <p className="text-red-600 mb-4">Error: {error}</p>
//             <Button onClick={() => window.location.reload()}>
//               Try Again
//             </Button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-3xl font-bold tracking-tight">Client Management</h2>
//           <Button onClick={openAddModal} className="bg-[#a98cc8] hover:bg-[#9678b4]">
//             <UserPlus className="mr-2 h-4 w-4" />
//             Add New Client
//           </Button>
//         </div>

//         <ClientTable
//           clients={clients}
//           therapists={therapists}
//           filterStatus={filterStatus}
//           setFilterStatus={setFilterStatus}
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           onViewDetails={openDetailsModal}
//           onEditClient={openEditModal}
//           onDeactivateClient={handleDeactivateClient}
//         />
//       </div>

//       <ClientModals
//         showAddModal={showAddModal}
//         setShowAddModal={setShowAddModal}
//         showEditModal={showEditModal}
//         setShowEditModal={setShowEditModal}
//         showDetailsModal={showDetailsModal}
//         setShowDetailsModal={setShowDetailsModal}
//         selectedClient={selectedClient}
//         setSelectedClient={setSelectedClient}
//         therapists={therapists}
//         formData={formData}
//         setFormData={setFormData}
//         handleAddClient={handleAddClient}
//         handleEditClient={handleEditClient}
//         openEditModal={openEditModal}
//         resetForm={resetForm}
//         notification={notification}
//         closeNotification={closeNotification}
//       />
//     </div>
//   )
// }

//Main container with state management and API calls (Updated - No Therapist Assignment)
"use client"

import { useState, useEffect } from "react"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User, Therapist, Notification, FormData } from "./types"
import ClientTable from "./ClientTable"
import ClientModals from "./ClientModals"

export default function ClientsPage() {
  const [clients, setClients] = useState<User[]>([])
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [notification, setNotification] = useState<Notification | null>(null)
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<User | null>(null)
  
  // Form state - removed assigned_tid field
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    is_active: true,
    call_request_status: 'none',
    form_response: ''
  })

  // Fetch clients and therapists from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const [usersResponse, therapistsResponse] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/therapists')
        ])
        
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch clients')
        }
        
        if (!therapistsResponse.ok) {
          throw new Error('Failed to fetch therapists')
        }
        
        const usersData = await usersResponse.json()
        const therapistsData = await therapistsResponse.json()
        
        if (usersData.error) {
          throw new Error(usersData.error)
        }
        
        if (therapistsData.error) {
          throw new Error(therapistsData.error)
        }
        
        setClients(usersData.users || [])
        setTherapists(therapistsData.therapists || therapistsData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const showNotification = (message: string, details?: string) => {
    setNotification({ message, details })
  }

  const closeNotification = () => {
    setNotification(null)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      is_active: true,
      call_request_status: 'none',
      form_response: ''
    })
  }

  const handleDeactivateClient = async (client: User) => {
    try {
      const response = await fetch(`/api/users/${client.uid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: false
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to deactivate client')
      }

      setClients(prev => prev.map(c => 
        c.uid === client.uid 
          ? { ...c, is_active: false }
          : c
      ))
      
      showNotification('Success', `Client "${client.name}" has been deactivated.`)
      
    } catch (error) {
      showNotification('Error', error instanceof Error ? error.message : 'Failed to deactivate client')
    }
  }

const handleAddClient = async () => {
  try {
    console.log('=== FRONTEND REQUEST START ===');
    console.log('Initial formData:', formData);

    if (!formData.name || !formData.email) {
      showNotification('Error', 'Name and Email are required fields.');
      return;
    }

    // Parse form_response 
    let parsedFormResponse = null;
    try {
      parsedFormResponse = formData.form_response ? JSON.parse(formData.form_response) : null;
      console.log('Parsed form response:', parsedFormResponse);
    } catch (e) {
      console.error('JSON parse error:', e);
      showNotification('Error', 'Invalid JSON in form response field.');
      return;
    }

    const requestBody = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      assigned_tid: null, // Always null - no therapist assignment
      is_active: formData.is_active,
      call_request_status: formData.call_request_status,
      form_response: parsedFormResponse ? JSON.stringify(parsedFormResponse) : null
    };

    console.log('Request body to send:', requestBody);
    console.log('Request body JSON:', JSON.stringify(requestBody, null, 2));

    console.log('Making fetch request...');
    const response = await fetch('/api/admin/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response received:');
    console.log('- status:', response.status);
    console.log('- statusText:', response.statusText);
    console.log('- ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create client');
    }

    setClients(prev => [...prev, data.user]);
    setShowAddModal(false);
    resetForm();
    showNotification('Success', `Client "${formData.name}" has been created successfully.`);

    console.log('=== FRONTEND REQUEST SUCCESS ===');

  } catch (error) {
    console.error('=== FRONTEND REQUEST ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    showNotification('Error', error instanceof Error ? error.message : 'Failed to create client');
  }
};

  const handleEditClient = async () => {
    try {
      if (!selectedClient || !formData.name || !formData.email) {
        showNotification('Error', 'Name and Email are required fields.')
        return
      }

      let parsedFormResponse = null
      try {
        parsedFormResponse = formData.form_response ? JSON.parse(formData.form_response) : {}
      } catch (e) {
        parsedFormResponse = {}
      }

      const response = await fetch(`/api/users/${selectedClient.uid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          assigned_tid: null, // Always null - no therapist assignment
          is_active: formData.is_active,
          call_request_status: formData.call_request_status,
          form_response: parsedFormResponse
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update client')
      }

      setClients(prev => prev.map(client => 
        client.uid === selectedClient.uid 
          ? { ...client, ...formData, assigned_tid: null, form_response: parsedFormResponse }
          : client
      ))
      
      setShowEditModal(false)
      setSelectedClient(null)
      resetForm()
      showNotification('Success', `Client "${formData.name}" has been updated successfully.`)
      
    } catch (error) {
      showNotification('Error', error instanceof Error ? error.message : 'Failed to update client')
    }
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const openEditModal = (client: User) => {
    setSelectedClient(client)
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      is_active: client.is_active,
      call_request_status: client.call_request_status || 'none',
      form_response: client.form_response ? JSON.stringify(client.form_response, null, 2) : ''
    })
    setShowEditModal(true)
  }

  const openDetailsModal = (client: User) => {
    setSelectedClient(client)
    setShowDetailsModal(true)
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a98cc8] mb-4"></div>
            <p>Loading clients...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
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
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Client Management</h2>
          <Button onClick={openAddModal} className="bg-[#a98cc8] hover:bg-[#9678b4]">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </div>

        <ClientTable
          clients={clients}
          therapists={therapists}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onViewDetails={openDetailsModal}
          onEditClient={openEditModal}
          onDeactivateClient={handleDeactivateClient}
        />
      </div>

      <ClientModals
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        therapists={therapists}
        formData={formData}
        setFormData={setFormData}
        handleAddClient={handleAddClient}
        handleEditClient={handleEditClient}
        openEditModal={openEditModal}
        resetForm={resetForm}
        notification={notification}
        closeNotification={closeNotification}
      />
    </div>
  )
}