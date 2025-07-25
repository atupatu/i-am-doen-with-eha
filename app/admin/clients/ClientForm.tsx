// //Reusable form component used by both Add and Edit modals
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { FormData, Therapist } from "./types"

// interface ClientFormProps {
//   formData: FormData
//   setFormData: React.Dispatch<React.SetStateAction<FormData>>
//   therapists: Therapist[]
//   onSubmit: () => void
//   onCancel: () => void
//   isEdit?: boolean
//   submitLabel?: string
// }

// const formFields = {
//   "seniorName": "Name of the Senior Citizen *",
//   "preferredName": "How would you like us to address them?",
//   "diagnosis": "Diagnosis *",
//   "otherDiagnosis": "If Other, please specify",
//   "timeSlots": "Preferred Time slots for Session *",
//   "address": "Address (To conduct sessions) *",
//   "language": "Language Preference *",
//   "otherLanguage": "If Other, please specify",
//   "dob": "Date of Birth (or approximate birth year)",
//   "birthPlace": "Where were you born?",
//   "family": "Parents and siblings – Comment on relationships",
//   "educationHistory": "Education History",
//   "workHistory": "Work History",
//   "spouseName": "Partner/Spouse Name",
//   "meetingDetails": "When and where did you meet your spouse?",
//   "children": "Children (names, other info)",
//   "grandchildren": "Grandchildren (names)",
//   "historicalEvent": "Have you witnessed any major historical events?",
//   "hobbies": "Hobbies and interests",
//   "currentEnjoyment": "What do you enjoy doing now?",
//   "readingPreferences": "What do you like to read?",
//   "favColor": "Favourite colour? One you don't like?",
//   "musicTaste": "What kind of music do you like?",
//   "favFood": "Favourite food and drink?",
//   "routine": "Daily Routine",
//   "carerName": "Family member/Carer for communication",
//   "carerPhone": "Contact Number of Family member/Carer",
//   "invoiceEmail": "Email Address (To send invoice)",
//   "payerPhone": "Contact Number for Payer of Invoice"
// }

// export default function ClientForm({
//   formData,
//   setFormData,
//   therapists,
//   onSubmit,
//   onCancel,
//   isEdit = false,
//   submitLabel = "Create Client"
// }: ClientFormProps) {
  
//   // Parse form response or initialize with empty object
//   const parseFormResponse = () => {
//     try {
//       return formData.form_response ? JSON.parse(formData.form_response) : {}
//     } catch {
//       return {}
//     }
//   }

//   const formResponseData = parseFormResponse()

//   // Update individual form response field
//   const updateFormResponseField = (fieldKey: string, value: string) => {
//     const updatedData = {
//       ...formResponseData,
//       [fieldKey]: value
//     }
//     setFormData(prev => ({ 
//       ...prev, 
//       form_response: JSON.stringify(updatedData, null, 2)
//     }))
//   }

//   return (
//     <div className="space-y-6">
//       {/* Basic Information */}
//       <div className="space-y-4">
//         <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor={isEdit ? "edit_name" : "name"}>Name *</Label>
//             <Input
//               id={isEdit ? "edit_name" : "name"}
//               value={formData.name}
//               onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//               placeholder="Enter client name"
//             />
//           </div>
//           <div>
//             <Label htmlFor={isEdit ? "edit_email" : "email"}>Email *</Label>
//             <Input
//               id={isEdit ? "edit_email" : "email"}
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//               placeholder="Enter email address"
//             />
//           </div>
//         </div>
        
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor={isEdit ? "edit_phone" : "phone"}>Phone</Label>
//             <Input
//               id={isEdit ? "edit_phone" : "phone"}
//               value={formData.phone}
//               onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
//               placeholder="Enter phone number"
//             />
//           </div>
//           <div>
//             <Label htmlFor={isEdit ? "edit_therapist" : "therapist"}>Assigned Therapist</Label>
//             <Select
//               value={formData.assigned_tid || "unassigned"}
//               onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_tid: value === "unassigned" ? "" : value }))}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select therapist" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="unassigned">Unassigned</SelectItem>
//                 {therapists.map((therapist) => (
//                   <SelectItem key={therapist.tid} value={therapist.tid}>
//                     {therapist.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor={isEdit ? "edit_call_status" : "call_status"}>Call Status</Label>
//             <Select
//               value={formData.call_request_status}
//               onValueChange={(value) => setFormData(prev => ({ ...prev, call_request_status: value as 'pending' | 'completed' | 'none' }))}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="none">None</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="completed">Completed</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="flex items-center space-x-2 pt-6">
//             <Switch
//               id={isEdit ? "edit_is_active" : "is_active"}
//               checked={formData.is_active}
//               onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
//             />
//             <Label htmlFor={isEdit ? "edit_is_active" : "is_active"}>Active Client</Label>
//           </div>
//         </div>
//       </div>

//       {/* Detailed Information Form */}
//       <div className="space-y-4">
//         <h4 className="text-lg font-medium text-gray-900">Detailed Information</h4>
//         <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
//           <div className="space-y-4">
//             {Object.entries(formFields).map(([fieldKey, fieldLabel]) => (
//               <div key={fieldKey} className="grid grid-cols-1 gap-2">
//                 <Label htmlFor={`${isEdit ? 'edit_' : ''}${fieldKey}`} className="text-sm font-medium text-gray-700">
//                   {fieldLabel}
//                 </Label>
//                 <Input
//                   id={`${isEdit ? 'edit_' : ''}${fieldKey}`}
//                   value={formResponseData[fieldKey] || ''}
//                   onChange={(e) => updateFormResponseField(fieldKey, e.target.value)}
//                   placeholder={fieldLabel.replace(' *', '')}
//                   className="bg-white"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end gap-2 mt-6">
//         <Button variant="outline" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button onClick={onSubmit} className="bg-[#a98cc8] hover:bg-[#9678b4]">
//           {submitLabel}
//         </Button>
//       </div>
//     </div>
//   )
// }

//Reusable form component used by both Add and Edit modals (Updated - No Therapist Assignment)
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormData, Therapist } from "./types"

interface ClientFormProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  therapists: Therapist[]
  onSubmit: () => void
  onCancel: () => void
  isEdit?: boolean
  submitLabel?: string
}

const formFields = {
  "seniorName": "Name of the Senior Citizen *",
  "preferredName": "How would you like us to address them?",
  "diagnosis": "Diagnosis *",
  "otherDiagnosis": "If Other, please specify",
  "timeSlots": "Preferred Time slots for Session *",
  "address": "Address (To conduct sessions) *",
  "language": "Language Preference *",
  "otherLanguage": "If Other, please specify",
  "dob": "Date of Birth (or approximate birth year)",
  "birthPlace": "Where were you born?",
  "family": "Parents and siblings – Comment on relationships",
  "educationHistory": "Education History",
  "workHistory": "Work History",
  "spouseName": "Partner/Spouse Name",
  "meetingDetails": "When and where did you meet your spouse?",
  "children": "Children (names, other info)",
  "grandchildren": "Grandchildren (names)",
  "historicalEvent": "Have you witnessed any major historical events?",
  "hobbies": "Hobbies and interests",
  "currentEnjoyment": "What do you enjoy doing now?",
  "readingPreferences": "What do you like to read?",
  "favColor": "Favourite colour? One you don't like?",
  "musicTaste": "What kind of music do you like?",
  "favFood": "Favourite food and drink?",
  "routine": "Daily Routine",
  "carerName": "Family member/Carer for communication",
  "carerPhone": "Contact Number of Family member/Carer",
  "invoiceEmail": "Email Address (To send invoice)",
  "payerPhone": "Contact Number for Payer of Invoice"
}

export default function ClientForm({
  formData,
  setFormData,
  therapists,
  onSubmit,
  onCancel,
  isEdit = false,
  submitLabel = "Create Client"
}: ClientFormProps) {
  
  // Parse form response or initialize with empty object
  const parseFormResponse = () => {
    try {
      return formData.form_response ? JSON.parse(formData.form_response) : {}
    } catch {
      return {}
    }
  }

  const formResponseData = parseFormResponse()

  // Update individual form response field
  const updateFormResponseField = (fieldKey: string, value: string) => {
    const updatedData = {
      ...formResponseData,
      [fieldKey]: value
    }
    setFormData(prev => ({ 
      ...prev, 
      form_response: JSON.stringify(updatedData, null, 2)
    }))
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={isEdit ? "edit_name" : "name"}>Name *</Label>
            <Input
              id={isEdit ? "edit_name" : "name"}
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter client name"
            />
          </div>
          <div>
            <Label htmlFor={isEdit ? "edit_email" : "email"}>Email *</Label>
            <Input
              id={isEdit ? "edit_email" : "email"}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={isEdit ? "edit_phone" : "phone"}>Phone</Label>
            <Input
              id={isEdit ? "edit_phone" : "phone"}
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <Label htmlFor={isEdit ? "edit_call_status" : "call_status"}>Call Status</Label>
            <Select
              value={formData.call_request_status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, call_request_status: value as 'pending' | 'completed' | 'none' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={isEdit ? "edit_is_active" : "is_active"}
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor={isEdit ? "edit_is_active" : "is_active"}>Active Client</Label>
        </div>
      </div>

      {/* Detailed Information Form */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Detailed Information</h4>
        <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
          <div className="space-y-4">
            {Object.entries(formFields).map(([fieldKey, fieldLabel]) => (
              <div key={fieldKey} className="grid grid-cols-1 gap-2">
                <Label htmlFor={`${isEdit ? 'edit_' : ''}${fieldKey}`} className="text-sm font-medium text-gray-700">
                  {fieldLabel}
                </Label>
                <Input
                  id={`${isEdit ? 'edit_' : ''}${fieldKey}`}
                  value={formResponseData[fieldKey] || ''}
                  onChange={(e) => updateFormResponseField(fieldKey, e.target.value)}
                  placeholder={fieldLabel.replace(' *', '')}
                  className="bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} className="bg-[#a98cc8] hover:bg-[#9678b4]">
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}