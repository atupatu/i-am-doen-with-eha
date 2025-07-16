// This is a mock authentication utility for demo purposes
// In a real app, this would connect to your authentication system

export async function checkTherapistAuth(): Promise<boolean> {
    // In a real app, this would check the session/token
    // For demo purposes, we'll just return true
    return true
  }
  
  export async function getTherapistInfo() {
    // Mock therapist info
    return {
      id: 1,
      name: "Dr. Emma Wilson",
      email: "emma.wilson@mindfulcare.com",
      role: "therapist",
      specialty: "Cognitive Behavioral Therapy",
      experience: "12 years",
    }
  }
  