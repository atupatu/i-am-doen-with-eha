"use client"
import React, { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import TherapistCard from "@/components/therapist-grid";
import Navbar from "@/components/navbar";
import { Search } from 'lucide-react';


const therapists = [
  {
    id: 1,
    name: "Dr. Emma Wilson",
    specialization: "Cognitive Behavioral Therapy",
    experience: "8 years",
    image: "/images/emma_wilson.jpg",
    bio: "Specializes in CBT, helping clients challenge and change unhelpful thoughts and behaviors.",
    educationalQualification: "Ph.D. in Clinical Psychology, Stanford University",
    expertise: ["Depression", "Self-esteem issues", "Procrastination"],
    languagesSpoken: ["English", "Spanish"],
  },
  {
    id: 2,
    name: "Dr. James Chen",
    specialization: "Family Therapy",
    experience: "10 years",
    image: "/images/james_chen.jpg",
    bio: "Focuses on resolving family conflicts and improving communication between family members.",
    educationalQualification: "M.S. in Family Therapy, UCLA",
    expertise: ["Parent-child relationships", "Divorce mediation", "Grief counseling"],
    languagesSpoken: ["English", "Mandarin"],
  },
  {
    id: 3,
    name: "Dr. Marcus Johnson",
    specialization: "Anxiety Management",
    experience: "6 years",
    image: "/images/marcus_johnson.jpg",
    bio: "Works with clients to manage anxiety through mindfulness, journaling, and breathing techniques.",
    educationalQualification: "Psy.D. in Clinical Psychology, University of Michigan",
    expertise: ["Social anxiety", "Panic attacks", "Stress resilience"],
    languagesSpoken: ["English", "French"],
  },
];

export default function TherapistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Filter therapists based on search query and selected filter
  const filteredTherapists = therapists.filter((therapist) => {
    const matchesSearch =
      therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.expertise.some((expert) =>
        expert.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesFilter = selectedFilter
      ? therapist.expertise.some((expert) =>
          expert.toLowerCase().includes(selectedFilter.toLowerCase())
        )
      : true;

    return matchesSearch && matchesFilter;
  });

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
                placeholder="Search by name, specialty, or expertise..."
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
              className={`rounded-full ${selectedFilter === null ? "border-lavender text-dark-blue-gray" : "border-gray-300 text-dark-blue-gray"} hover:bg-lavender hover:text-white`}
              onClick={() => setSelectedFilter(null)}
            >
              All Specializations
            </Button>
            <Button
              variant="outline"
              className={`rounded-full ${selectedFilter === "Anxiety" ? "border-lavender text-dark-blue-gray" : "border-gray-300 text-dark-blue-gray"} hover:border-lavender`}
              onClick={() => setSelectedFilter("Anxiety")}
            >
              Anxiety
            </Button>
            <Button
              variant="outline"
              className={`rounded-full ${selectedFilter === "Depression" ? "border-lavender text-dark-blue-gray" : "border-gray-300 text-dark-blue-gray"} hover:border-lavender`}
              onClick={() => setSelectedFilter("Depression")}
            >
              Depression
            </Button>
            <Button
              variant="outline"
              className={`rounded-full ${selectedFilter === "Family Therapy" ? "border-lavender text-dark-blue-gray" : "border-gray-300 text-dark-blue-gray"} hover:border-lavender`}
              onClick={() => setSelectedFilter("Family Therapy")}
            >
              Family Therapy
            </Button>
            <Button
              variant="outline"
              className={`rounded-full ${selectedFilter === "Grief counseling" ? "border-lavender text-dark-blue-gray" : "border-gray-300 text-dark-blue-gray"} hover:border-lavender`}
              onClick={() => setSelectedFilter("Grief counseling")}
            >
              Grief Counseling
            </Button>
          </div>

          {/* Therapist Grid */}
          <div className="space-y-6">
            {filteredTherapists.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
