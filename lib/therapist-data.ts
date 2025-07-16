// This file contains mock data functions for the therapist portal
// In a real app, these would fetch data from your API/database

export async function getTherapistData() {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))
  
    return {
      stats: {
        totalClients: 42,
        activeClients: 28,
        todaySessions: 5,
        weekSessions: 18,
        reportsDue: 3,
        newClients: 4,
      },
      upcomingAppointments: [
        {
          id: 1,
          clientName: "John Smith",
          clientImage: "/placeholder.svg?height=40&width=40",
          date: "2025-04-24",
          time: "10:00 AM - 11:00 AM",
          type: "Cognitive Behavioral Therapy",
          location: "Online Session",
          status: "confirmed",
          mode: "online",
        },
        {
          id: 2,
          clientName: "Sarah Johnson",
          clientImage: "/placeholder.svg?height=40&width=40",
          date: "2025-04-24",
          time: "2:00 PM - 3:00 PM",
          type: "Anxiety Management",
          location: "Office 3B",
          status: "confirmed",
          mode: "in-person",
        },
        {
          id: 3,
          clientName: "Robert Chen",
          clientImage: "/placeholder.svg?height=40&width=40",
          date: "2025-04-25",
          time: "11:00 AM - 12:00 PM",
          type: "Depression Therapy",
          location: "Online Session",
          status: "confirmed",
          mode: "online",
        },
      ],
      pendingRequests: [
        {
          id: 101,
          clientName: "Maria Garcia",
          clientImage: "/placeholder.svg?height=40&width=40",
          date: "2025-04-26",
          time: "3:00 PM - 4:00 PM",
          type: "Initial Consultation",
          location: "Office 3B",
          mode: "in-person",
        },
        {
          id: 102,
          clientName: "David Lee",
          clientImage: "/placeholder.svg?height=40&width=40",
          date: "2025-04-27",
          time: "10:00 AM - 11:00 AM",
          type: "Cognitive Behavioral Therapy",
          location: "Online Session",
          mode: "online",
        },
      ],
    }
  }
  
  export async function getTherapistAppointments() {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))
  
    return {
      appointments: [
        {
          id: 1,
          clientName: "John Smith",
          clientImage: "/placeholder.svg?height=40&width=40",
          date: "2025-04-24",
          time: "10:00 AM - 11:00 AM",
          type: "Cognitive Behavioral Therapy",
          location: "Online Session",
          status: "confirmed",
          mode: "online",
        },
        {
          id: 2,
          clientName: "Sarah Johnson",
          clientImage: "/placeholder.svg?height=40&width=40",
          date: "2025-04-24",
          time: "2:00 PM - 3:00 PM",
          type: "Anxiety Management",
          location: "Office 3B",
          address: "123 Serenity Lane, Peaceful City, CA 90210",
          status: "confirmed",
          mode: "in-person",
        },
        {
          id: 3,
          clientName: "Robert Chen",
          clientImage: "/placeholder.svg?height=40&width=40",
          date: "2025-04-25",
          time: "11:00 AM - 12:00 PM",
          type: "Depression Therapy",
          location: "Online Session",
          status: "confirmed",
          mode: "online",
        },
        {
          id: 4,
          clientName: "Emily Davis",
          clientImage: "/placeholder.svg?height=40&width=40",
          date: "2025-04-23",
          time: "9:00 AM - 10:00 AM",
          type: "Cognitive Behavioral Therapy",
          location: "Office 3B",
          address: "456 Tranquil Street, Peaceful City, CA 90210",
          status: "completed",
          mode: "in-person",
        },
        {
          id: 5,
          clientName: "Michael Wilson",
          clientImage: "/placeholder.svg?height=40&width=40",
          date: "2025-04-22",
          time: "3:00 PM - 4:00 PM",
          type: "Anxiety Management",
          location: "Online Session",
          status: "completed",
          mode: "online",
        },
      ],
      availability: {
        monday: {
          isAvailable: true,
          timeSlots: [
            { start: "09:00", end: "12:00" },
            { start: "13:00", end: "17:00" },
          ],
        },
        tuesday: {
          isAvailable: true,
          timeSlots: [
            { start: "09:00", end: "12:00" },
            { start: "13:00", end: "17:00" },
          ],
        },
        wednesday: {
          isAvailable: true,
          timeSlots: [
            { start: "09:00", end: "12:00" },
            { start: "13:00", end: "17:00" },
          ],
        },
        thursday: {
          isAvailable: true,
          timeSlots: [
            { start: "09:00", end: "12:00" },
            { start: "13:00", end: "17:00" },
          ],
        },
        friday: {
          isAvailable: true,
          timeSlots: [
            { start: "09:00", end: "12:00" },
            { start: "13:00", end: "17:00" },
          ],
        },
        saturday: {
          isAvailable: false,
          timeSlots: [],
        },
        sunday: {
          isAvailable: false,
          timeSlots: [],
        },
        maxHoursPerWeek: 40,
      },
    }
  }
  
  export async function getTherapistClients() {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))
  
    return {
      activeClients: [
        {
          id: 1,
          name: "John Smith",
          image: "/placeholder.svg?height=48&width=48",
          age: 68,
          gender: "Male",
          diagnosis: "Mild Cognitive Impairment",
          status: "active",
          lastSession: "2025-04-23",
          nextSession: "2025-04-30",
          contactInfo: {
            phone: "(555) 123-4567",
            email: "john.smith@example.com",
            address: "123 Serenity Lane, Peaceful City, CA 90210",
          },
        },
        {
          id: 2,
          name: "Sarah Johnson",
          image: "/placeholder.svg?height=48&width=48",
          age: 72,
          gender: "Female",
          diagnosis: "Depression",
          status: "active",
          lastSession: "2025-04-24",
          nextSession: "2025-05-01",
          contactInfo: {
            phone: "(555) 234-5678",
            email: "sarah.johnson@example.com",
            address: "456 Tranquil Street, Peaceful City, CA 90210",
          },
        },
        {
          id: 3,
          name: "Robert Chen",
          image: "/placeholder.svg?height=48&width=48",
          age: 65,
          gender: "Male",
          diagnosis: "Anxiety",
          status: "active",
          lastSession: "2025-04-25",
          nextSession: "2025-05-02",
          contactInfo: {
            phone: "(555) 345-6789",
            email: "robert.chen@example.com",
            address: "789 Calm Avenue, Peaceful City, CA 90210",
          },
        },
        {
          id: 4,
          name: "Maria Garcia",
          image: "/placeholder.svg?height=48&width=48",
          age: 70,
          gender: "Female",
          diagnosis: "Early Stage Dementia",
          status: "new",
          nextSession: "2025-04-26",
          contactInfo: {
            phone: "(555) 456-7890",
            email: "maria.garcia@example.com",
            address: "101 Serene Boulevard, Peaceful City, CA 90210",
          },
        },
      ],
      inactiveClients: [
        {
          id: 5,
          name: "David Lee",
          image: "/placeholder.svg?height=48&width=48",
          age: 75,
          gender: "Male",
          diagnosis: "Depression",
          status: "inactive",
          lastSession: "2025-03-15",
          contactInfo: {
            phone: "(555) 567-8901",
            email: "david.lee@example.com",
            address: "202 Quiet Street, Peaceful City, CA 90210",
          },
        },
        {
          id: 6,
          name: "Emily Davis",
          image: "/placeholder.svg?height=48&width=48",
          age: 67,
          gender: "Female",
          diagnosis: "Anxiety",
          status: "inactive",
          lastSession: "2025-03-20",
          contactInfo: {
            phone: "(555) 678-9012",
            email: "emily.davis@example.com",
            address: "303 Peaceful Lane, Peaceful City, CA 90210",
          },
        },
      ],
    }
  }
  
  export async function getTherapistReports() {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))
  
    return {
      reports: [
        {
          id: 1,
          title: "Initial Assessment Report - John Smith",
          clientName: "John Smith",
          clientId: 1,
          date: "2025-04-10",
          type: "assessment",
          status: "published",
          content:
            "Patient presents with symptoms of mild cognitive impairment. Memory tests show slight decline in short-term memory but long-term memory remains intact. Recommended cognitive exercises and weekly therapy sessions.\n\nPatient is responsive to therapy and shows good engagement. Family support is strong which is a positive factor in treatment outcomes.",
          fileUrl: "/reports/assessment-john-smith.pdf",
        },
        {
          id: 2,
          title: "Session Report - Sarah Johnson",
          clientName: "Sarah Johnson",
          clientId: 2,
          date: "2025-04-24",
          type: "session",
          status: "published",
          content:
            "Today's session focused on depression management techniques. Patient reported improved mood over the past week after implementing suggested mindfulness exercises. Sleep patterns have improved slightly.\n\nWe discussed additional coping strategies for dealing with feelings of loneliness. Patient agreed to try joining the senior center's weekly social activities as a way to increase social interactions.",
        },
        {
          id: 3,
          title: "Progress Report - Robert Chen",
          clientName: "Robert Chen",
          clientId: 3,
          date: "2025-04-20",
          type: "progress",
          status: "published",
          content:
            "Mr. Chen has shown significant improvement in managing anxiety symptoms over the past month. Panic attacks have decreased from 3-4 per week to 1 per week. Sleep quality has improved.\n\nBreathing techniques and progressive muscle relaxation exercises have been particularly effective. Patient reports feeling more in control of his anxiety responses.",
          fileUrl: "/reports/progress-robert-chen.pdf",
        },
      ],
      draftReports: [
        {
          id: 4,
          title: "Treatment Plan - Maria Garcia",
          clientName: "Maria Garcia",
          clientId: 4,
          date: "2025-04-25",
          type: "treatment",
          status: "draft",
          content:
            "Initial treatment plan for Ms. Garcia focusing on early stage dementia management. Goals include:\n\n1. Cognitive stimulation exercises 3x weekly\n2. Memory enhancement techniques\n3. Family education on dementia progression and care\n4. Establishing daily routines to reduce confusion\n\n[DRAFT - Need to add medication recommendations after consultation with neurologist]",
        },
      ],
    }
  }
  
  export async function getTherapistProfile() {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))
  
    return {
      id: 1,
      name: "Dr. Emma Wilson",
      email: "emma.wilson@mindfulcare.com",
      phone: "(555) 987-6543",
      specialty: "Cognitive Behavioral Therapy",
      experience: "12 years",
      education: [
        {
          degree: "Ph.D. in Clinical Psychology",
          institution: "Stanford University",
          year: "2013",
        },
        {
          degree: "M.A. in Psychology",
          institution: "University of California, Berkeley",
          year: "2010",
        },
        {
          degree: "B.A. in Psychology",
          institution: "University of Washington",
          year: "2008",
        },
      ],
      certifications: [
        {
          name: "Licensed Clinical Psychologist",
          issuer: "California Board of Psychology",
          year: "2014",
        },
        {
          name: "Certified Cognitive Behavioral Therapist",
          issuer: "American Board of Professional Psychology",
          year: "2015",
        },
      ],
      bio: "Dr. Emma Wilson specializes in cognitive behavioral therapy with a focus on geriatric mental health. With over 12 years of experience, she has helped hundreds of seniors manage conditions such as depression, anxiety, and cognitive impairment. Her approach combines evidence-based techniques with compassionate care to improve quality of life for older adults.",
      notificationSettings: {
        email: {
          newAppointments: true,
          appointmentReminders: true,
          appointmentChanges: true,
          newClients: true,
          reportReminders: true,
        },
        sms: {
          newAppointments: true,
          appointmentReminders: true,
          appointmentChanges: false,
          newClients: false,
          reportReminders: false,
        },
        inApp: {
          newAppointments: true,
          appointmentReminders: true,
          appointmentChanges: true,
          newClients: true,
          reportReminders: true,
        },
      },
      accountSettings: {
        twoFactorEnabled: true,
        lastPasswordChange: "2025-03-15",
        loginNotifications: true,
        sessionTimeout: 30,
      },
    }
  }
  