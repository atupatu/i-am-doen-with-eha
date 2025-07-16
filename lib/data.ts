import type { AppointmentProps } from "./types"

// This would typically fetch data from a database
export async function getAppointments() {
  // Simulate a database call with a delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const upcomingAppointments: AppointmentProps[] = [
    {
      id: 1,
      date: "Monday, April 15, 2024",
      time: "10:00 AM - 11:00 AM",
      therapist: "Dr. Emma Wilson",
      type: "Cognitive Behavioral Therapy",
      notes:
        "We'll continue working on anxiety management techniques and review your progress from last week's exercises.",
    },
    {
      id: 2,
      date: "Thursday, April 18, 2024",
      time: "2:00 PM - 3:00 PM",
      therapist: "Dr. James Chen",
      type: "Family Therapy",
      notes: "This session will focus on communication strategies and resolving conflicts within the family dynamic.",
    },
    {
      id: 3,
      date: "Monday, April 22, 2024",
      time: "3:30 PM - 4:30 PM",
      therapist: "Dr. Marcus Johnson",
      type: "Anxiety Management",
      notes: "We'll explore mindfulness techniques and develop a personalized anxiety response plan.",
    },
  ]

  const pastAppointments: AppointmentProps[] = [
    {
      id: 4,
      date: "Monday, April 8, 2024",
      time: "10:00 AM - 11:00 AM",
      therapist: "Dr. Emma Wilson",
      type: "Cognitive Behavioral Therapy",
      notes: "Discussed thought patterns and introduced cognitive restructuring techniques.",
      report: "session_report_04082024.pdf",
    },
    {
      id: 5,
      date: "Thursday, April 4, 2024",
      time: "2:00 PM - 3:00 PM",
      therapist: "Dr. James Chen",
      type: "Family Therapy",
      notes: "Session canceled due to therapist illness. Rescheduled for April 18.",
    },
    {
      id: 6,
      date: "Monday, April 1, 2024",
      time: "3:30 PM - 4:30 PM",
      therapist: "Dr. Marcus Johnson",
      type: "Anxiety Management",
      notes: "Initial assessment completed. Identified key triggers and established baseline.",
      report: "session_report_04012024.pdf",
    },
  ]

  return { upcomingAppointments, pastAppointments }
}

export async function getTherapists() {
  // Simulate a database call
  await new Promise((resolve) => setTimeout(resolve, 300))

  return [
    {
      id: 1,
      name: "Dr. Emma Wilson",
      specialty: "Cognitive Behavioral Therapy",
      experience: "12 years",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 2,
      name: "Dr. James Chen",
      specialty: "Family Therapy",
      experience: "8 years",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 3,
      name: "Dr. Olivia Martinez",
      specialty: "Trauma Recovery",
      experience: "15 years",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 4,
      name: "Dr. Marcus Johnson",
      specialty: "Anxiety & Depression",
      experience: "10 years",
      image: "/placeholder.svg?height=400&width=400",
    },
  ]
}
