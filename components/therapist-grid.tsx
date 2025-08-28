//components/therapist-grid.tsx
"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MapPin, GraduationCap } from "lucide-react";

interface Therapist {
  tid: string;
  name: string;
  education: string;
  bio: string;
  areas_covered: string;
  image?: string;
}

interface TherapistCardProps {
  therapists: Therapist[];
}

export default function TherapistCard({ therapists }: TherapistCardProps) {
  const router = useRouter();

  const handleViewTherapist = (tid: string) => {
    router.push(`/client/therapists/${tid}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {therapists.map((therapist) => (
        <div
          key={therapist.tid}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100"
        >
          {/* Therapist Avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-gray-600">
                {therapist.name.charAt(0)}
              </span>
            </div>
          </div>

          {/* Therapist Name */}
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
            {therapist.name}
          </h3>

          {/* Education */}
          <div className="flex items-start gap-3 mb-3">
            <GraduationCap className="text-gray-500 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-700">Education</p>
              <p className="text-sm text-gray-600">{therapist.education || "Not specified"}</p>
            </div>
          </div>

          {/* Location (using areas_covered as location for now) */}
          <div className="flex items-start gap-3 mb-6">
            <MapPin className="text-gray-500 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-700">Areas Covered</p>
              <p className="text-sm text-gray-600">
                {therapist.areas_covered ? 
                  therapist.areas_covered.split(',').slice(0, 2).join(', ') + 
                  (therapist.areas_covered.split(',').length > 2 ? '...' : '') 
                  : "Not specified"
                }
              </p>
            </div>
          </div>

          {/* View Therapist Button */}
          <Button
            onClick={() => handleViewTherapist(therapist.tid)}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
          >
            View Therapist
          </Button>
        </div>
      ))}
    </div>
  );
}