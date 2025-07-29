import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, GraduationCap, Sparkles } from "lucide-react"

interface Therapist {
  tid: string;
  name: string;
  education: string;
  bio: string;
  areas_covered: string; // Changed to string
  image?: string;
}

interface TherapistGridProps {
  therapists: Therapist[];
}

export default function TherapistGrid({ therapists }: TherapistGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {therapists.map((therapist) => {
        // Convert areas_covered string to array
        const areasArray = therapist.areas_covered 
          ? therapist.areas_covered.split(',').map(area => area.trim())
          : [];

        return (
          <div
            key={therapist.tid}
            className="bg-white rounded-3xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 flex flex-col"
          >
            <div className="relative h-64 w-full">
              <Image 
                src={therapist.image || "/images/therapist_placeholder.jpg"} 
                alt={therapist.name} 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-xl font-semibold mb-1">{therapist.name}</h3>
                <p className="text-[#a98cc8] font-medium mb-2">{therapist.education}</p>
                <p className="text-gray-600 text-sm mb-3">{therapist.bio}</p>
                
                {/* Qualification */}
                <div className="flex items-start gap-2 text-sm text-gray-700 mb-2">
                  <GraduationCap className="w-4 h-4 mt-0.5 text-[#a98cc8] flex-shrink-0" />
                  <span className="bg-[#f4f0fa] px-2 py-1 rounded-lg text-xs">{therapist.education}</span>
                </div>
                
                {/* Expertise */}
                {areasArray.length > 0 && (
                  <div className="flex items-start gap-2 text-sm text-gray-700 mb-2">
                    <Sparkles className="w-4 h-4 mt-0.5 text-[#a98cc8] flex-shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {areasArray.map((area, i) => (
                        <span key={i} className="bg-[#f4f0fa] text-xs px-2 py-0.5 rounded-full">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button className="w-full bg-[#a98cc8] hover:bg-[#9678b4] text-white flex items-center justify-center gap-2 rounded-xl mt-auto">
                <Calendar className="h-4 w-4" />
                Book Session
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}