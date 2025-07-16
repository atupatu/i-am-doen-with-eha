import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, GraduationCap, Languages, Sparkles } from "lucide-react"

const therapists = [
  {
    id: 1,
    name: "Dr. Emma Wilson",
    specialty: "Cognitive Behavioral Therapy",
    experience: "12 years",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2787&auto=format&fit=crop",
    educationalQualification: "Ph.D. in Clinical Psychology",
    expertise: ["Depression", "Self-esteem", "Procrastination"],
    languagesSpoken: ["English", "Spanish"],
  },
  {
    id: 2,
    name: "Dr. James Chen",
    specialty: "Family Therapy",
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2940&auto=format&fit=crop",
    educationalQualification: "M.S. in Family Therapy",
    expertise: ["Family conflict", "Parenting", "Child behavior"],
    languagesSpoken: ["English", "Mandarin"],
  },
  {
    id: 3,
    name: "Dr. Olivia Martinez",
    specialty: "Trauma Recovery",
    experience: "15 years",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2940&auto=format&fit=crop",
    educationalQualification: "Psy.D. in Clinical Psychology",
    expertise: ["PTSD", "Sexual trauma", "EMDR"],
    languagesSpoken: ["English", "Spanish", "Portuguese"],
  },
  {
    id: 4,
    name: "Dr. Marcus Johnson",
    specialty: "Anxiety & Depression",
    experience: "10 years",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2787&auto=format&fit=crop",
    educationalQualification: "Ph.D. in Psychiatry",
    expertise: ["Social anxiety", "Panic disorders", "Mood swings"],
    languagesSpoken: ["English", "French"],
  },
]


export default function TherapistGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {therapists.map((therapist) => (
        <div
          key={therapist.id}
          className="bg-white rounded-3xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 flex flex-col"
        >
          <div className="relative h-64 w-full">
            <Image src={therapist.image || "/placeholder.svg"} alt={therapist.name} fill className="object-cover" />
          </div>
          <div className="p-6 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="text-xl font-semibold mb-1">{therapist.name}</h3>
              <p className="text-[#a98cc8] font-medium mb-2">{therapist.specialty}</p>
              <p className="text-gray-600 text-sm mb-3">{therapist.experience} experience</p>

              {/* Qualification */}
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <GraduationCap className="w-4 h-4 text-[#a98cc8]" />
                <span className="bg-[#f4f0fa] px-2 py-1 rounded-lg text-xs">{therapist.educationalQualification}</span>
              </div>

              {/* Expertise */}
              <div className="flex items-start gap-2 text-sm text-gray-700 mb-2">
                <Sparkles className="w-4 h-4 mt-1 text-[#a98cc8]" />
                <div className="flex flex-wrap gap-1">
                  {therapist.expertise.map((skill, i) => (
                    <span key={i} className="bg-[#f4f0fa] text-xs px-2 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="flex items-start gap-2 text-sm text-gray-700 mb-4">
                <Languages className="w-4 h-4 mt-1 text-[#a98cc8]" />
                <div className="flex flex-wrap gap-1">
                  {therapist.languagesSpoken.map((lang, i) => (
                    <span key={i} className="bg-[#f4f0fa] text-xs px-2 py-0.5 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Button className="w-full bg-[#a98cc8] hover:bg-[#9678b4] text-white flex items-center justify-center gap-2 rounded-xl mt-auto">
              <Calendar className="h-4 w-4" />
              Book Session
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
