//app/client/therapists/page.tsx
"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TherapistCard from "@/components/therapist-grid";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { Search } from 'lucide-react';

interface Therapist {
  tid: string;
  name: string;
  education: string;
  bio: string;
  areas_covered: string;
  image?: string;
}

export default function TherapistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch('/api/therapists');
        const data = await response.json();
        if (data.therapists) {
          const formattedTherapists = data.therapists.map((therapist: any) => ({
            tid: therapist.tid,
            name: therapist.name,
            education: therapist.education,
            bio: therapist.bio,
            areas_covered: therapist.areas_covered || "",
            image: "/images/therapist_placeholder.jpg"
          }));
          setTherapists(formattedTherapists);
        }
      } catch (error) {
        console.error("Error fetching therapists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  // Filter therapists based on search query and selected filter
  const filteredTherapists = therapists.filter((therapist) => {
    const matchesSearch =
      therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.education?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.areas_covered?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter
      ? therapist.areas_covered?.toLowerCase().includes(selectedFilter.toLowerCase())
      : true;

    return matchesSearch && matchesFilter;
  });

  // Extract unique areas for filter buttons
  const uniqueAreas = Array.from(
    new Set(
      therapists.flatMap(t => 
        t.areas_covered ? t.areas_covered.split(',').map(area => area.trim()) : []
      )
    )
  ).slice(0, 4);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-[#fef6f9]/30">
          <div className="container py-12 text-center">Loading therapists...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-[#fef6f9]/30">
        <div className="container py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Meet Our Therapists</h1>
            <p className="text-gray-600">Get to know our trusted mental health professionals</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, education, or areas covered..."
                className="w-full py-3 px-4 pl-12 rounded-xl border border-gray-300 focus:border-lavender focus:ring focus:ring-lavender/20 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <Button
              variant="outline"
              className={`rounded-full ${selectedFilter === null ? "border-lavender text-dark-blue-gray" : "border-gray-300 text-dark-blue-gray"} hover:border-lavender `}
              onClick={() => setSelectedFilter(null)}
            >
              All Areas
            </Button>
            {uniqueAreas.map((area) => (
              <Button
                key={area}
                variant="outline"
                className={`rounded-full ${selectedFilter === area ? "border-lavender text-dark-blue-gray" : "border-gray-300 text-dark-blue-gray"} hover:border-lavender`}
                onClick={() => setSelectedFilter(area)}
              >
                {area}
              </Button>
            ))}
          </div>

          {/* Therapist Grid */}
          <div className="space-y-6">
            {filteredTherapists.length > 0 ? (
              <TherapistCard therapists={filteredTherapists} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No therapists found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}