//app/client/therapists/[tid]/page.tsx
"use client"
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { ArrowLeft, GraduationCap, MapPin, Heart, Lightbulb, Users, BookOpen } from "lucide-react";

interface TherapistDetail {
  tid: string;
  name: string;
  education: string;
  bio: string;
  areas_covered: string;
  languages: string;
  Why_counselling: string;
  One_thing: string;
  expect: string;
  selfcare_tips: string;
  image?: string;
}

export default function TherapistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [therapist, setTherapist] = useState<TherapistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapistDetail = async () => {
      try {
        const response = await fetch(`/api/therapists/${params.tid}`);
        const data = await response.json();
        
        if (response.ok) {
          setTherapist(data.therapist);
        } else {
          setError(data.error || "Failed to fetch therapist details");
        }
      } catch (error) {
        console.error("Error fetching therapist details:", error);
        setError("Failed to load therapist details");
      } finally {
        setLoading(false);
      }
    };

    if (params.tid) {
      fetchTherapistDetail();
    }
  }, [params.tid]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-[#fef6f9]/30">
          <div className="container py-12 text-center">
            <div className="animate-pulse">Loading therapist details...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-[#fef6f9]/30">
          <div className="container py-12 text-center">
            <p className="text-red-600 mb-4">{error || "Therapist not found"}</p>
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-[#fef6f9]/30">
        <div className="container py-8">
          {/* Back Button */}
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-6 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Therapists
          </Button>

          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-gray-600">
                      {therapist.name.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {therapist.name}
                  </h1>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="text-gray-500 mt-1" size={20} />
                      <div>
                        <p className="font-medium text-gray-700">Education</p>
                        <p className="text-gray-600">{therapist.education || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="text-gray-500 mt-1" size={20} />
                      <div>
                        <p className="font-medium text-gray-700">Areas Covered</p>
                        <p className="text-gray-600">{therapist.areas_covered || "Not specified"}</p>
                      </div>
                    </div>

                    {therapist.languages && (
                      <div className="flex items-start gap-3">
                        <Users className="text-gray-500 mt-1" size={20} />
                        <div>
                          <p className="font-medium text-gray-700">Languages</p>
                          <p className="text-gray-600">{therapist.languages}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {therapist.bio && (
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Me</h2>
                <p className="text-gray-700 leading-relaxed">{therapist.bio}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Why Counselling */}
              {therapist.Why_counselling && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center">
                      <Heart className="text-rose-400" size={18} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Why Counselling?</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">{therapist.Why_counselling}</p>
                </div>
              )}

              {/* One Thing */}
              {therapist.One_thing && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                      <Lightbulb className="text-amber-400" size={18} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">One Key Thing</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">{therapist.One_thing}</p>
                </div>
              )}

              {/* What to Expect */}
              {therapist.expect && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Users className="text-blue-400" size={18} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">What to Expect</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">{therapist.expect}</p>
                </div>
              )}

              {/* Self Care Tips */}
              {therapist.selfcare_tips && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                      <BookOpen className="text-green-400" size={18} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Self Care Tips</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">{therapist.selfcare_tips}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3"
              >
                Book a Session
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 px-8 py-3"
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}