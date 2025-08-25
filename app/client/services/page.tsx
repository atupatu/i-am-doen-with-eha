"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, Brain, Users, Sparkles, ArrowRight, ChevronDown, ChevronUp, Phone  } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { useEffect, useState } from "react"

interface Package {
  pid: number;
  name: string;
  description: string | null;
  cost: string;
  duration: string;
  min_commitment: string | null;
}

export default function InfoPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const dementiaFaqs = [
    {
      question: "What program features do you offer for dementia care?",
      answer: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Free initial occupational profiling assessment that will aid in creating the support plan</li>
          <li>Free assessment on the improvement in the 'Quality of Life' parameters</li>
        </ul>
      )
    },
    {
      question: "What activities are included in the sessions?",
      answer: "Our sessions include cognitive activities, Art Therapy, Music and reminiscence therapy."
    },
    {
      question: "How do you track progress?",
      answer: (
        <div>
          <p className="mb-2">Post each session, the facilitator does an assessment on EHA parameters to track changes and positive behavior observed in dementia patients. The two parameters used are:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Engagement of the patient during the session</li>
            <li>Mood of the patient before and after the session</li>
          </ul>
          <p className="mt-2">Monthly reports are generated based on this assessment and include information on the session activities.</p>
        </div>
      )
    },
    {
      question: "How do you assess Quality of Life improvements?",
      answer: "A longer-term therapy provided through various activities can create better impact on day-to-day life of the patient. We conduct assessments to check improvement in 'Well-being' and 'Quality of Life' for the elderly."
    }
  ];

  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/packages');
        
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }

        const data = await response.json();
        setPackages(data.packages || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-[#fef6f9] py-16 md:py-24">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl font-bold mb-6 text-gray-800">Our Therapy Packages</h1>
              <p className="text-lg text-gray-600">
                At Echoing Healthy Aging, we offer a variety of evidence-based therapeutic packages tailored to your unique
                needs and goals.
              </p>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#a98cc8]"></div>
                <p className="mt-4 text-gray-600">Loading packages...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading packages: {error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-[#a98cc8] hover:bg-[#9678b4] text-white"
                >
                  Try Again
                </Button>
              </div>
            )}

            {!loading && !error && packages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No packages available at the moment.</p>
              </div>
            )}

            {!loading && !error && packages.length > 0 && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {packages.map((pkg) => (
                  <div key={pkg.pid} className="bg-white p-8 rounded-3xl shadow-lg transition-transform duration-300 hover:-translate-y-2">
                    <div className="bg-[#f4c9c8]/30 p-4 rounded-full inline-block mb-6">
                      <Heart className="h-8 w-8 text-[#a98cc8]" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">{pkg.name}</h2>
                    
                    {pkg.description && (
                      <p className="text-gray-600 mb-6">{pkg.description}</p>
                    )}
                    
                    <div className="space-y-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-gray-700 font-medium whitespace-nowrap">Cost:</span>
                          <span className="text-[#a98cc8] font-bold text-right leading-tight">{pkg.cost}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-gray-700 font-medium whitespace-nowrap">Duration:</span>
                          <span className="text-gray-800 text-right leading-tight">{pkg.duration}</span>
                        </div>
                      </div>
                      
                      {pkg.min_commitment && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-gray-700 font-medium whitespace-nowrap">Min. Commitment:</span>
                            <span className="text-gray-800 text-right leading-tight">{pkg.min_commitment}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Link href="./signin" passHref>
                      <Button className="w-full bg-[#a98cc8] hover:bg-[#9678b4] text-white rounded-xl">
                        Select Package
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        
        
        <section className="bg-[#fef6f9] py-16 md:py-24">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl font-bold mb-6 text-gray-800">Our Therapeutic Approaches</h1>
              <p className="text-lg text-gray-600">
                At Echoing Healthy Aging, we offer a variety of evidence-based therapeutic approaches tailored to your unique
                needs and goals.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white p-8 rounded-3xl shadow-lg transition-transform duration-300 hover:-translate-y-2">
                <div className="bg-[#f4c9c8]/30 p-4 rounded-full inline-block mb-6">
                  <Brain className="h-8 w-8 text-[#a98cc8]" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Stuck in a Thought Loop?</h2>
                <p className="text-gray-600 mb-6">
                  Cognitive Behavioral Therapy (CBT) helps you break free from negative thoughts that affect your mood and actions.
                  It's a practical way to feel better, especially if you're dealing with anxiety, stress, or depression.
                </p>

                <Link href="#" className="text-[#a98cc8] font-medium flex items-center hover:underline">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg transition-transform duration-300 hover:-translate-y-2">
                <div className="bg-[#f4c9c8]/30 p-4 rounded-full inline-block mb-6">
                  <Users className="h-8 w-8 text-[#a98cc8]" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Feeling Lonely or Left Out?</h2>
                <p className="text-gray-600 mb-6">
                  Companionship therapy is about building real, meaningful connections. It gives you someone to talk to, lean on,
                  and share moments with—especially helpful during big life changes or when you're feeling isolated.
                </p>

                <Link href="#" className="text-[#a98cc8] font-medium flex items-center hover:underline">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg transition-transform duration-300 hover:-translate-y-2">
                <div className="bg-[#f4c9c8]/30 p-4 rounded-full inline-block mb-6">
                  <Sparkles className="h-8 w-8 text-[#a98cc8]" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Looking to Stay Sharp?</h2>
                <p className="text-gray-600 mb-6">
                  This therapy involves fun and engaging activities that boost memory and thinking skills. It's ideal for those
                  facing memory challenges or simply looking to stay mentally active and energized.
                </p>

                <Link href="#" className="text-[#a98cc8] font-medium flex items-center hover:underline">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Caregiver Support Info Block */}
        <section className="py-16 bg-gradient-to-br from-[#a98cc8]/25 via-[#b899d1]/20 to-[#c8a8d8]/25">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-8 rounded-3xl shadow-xl border-0 relative overflow-hidden">
                
                <div className="relative z-10 text-center">
                  <div className="bg-gradient-to-r from-[#a98cc8] to-[#f4c9c8] p-4 rounded-full inline-block mb-6">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-6 text-gray-800">
                    Compassionate Caregiver Support
                  </h2>
                  
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
                    Along with therapy services, we also offer compassionate caregiver support for senior citizens to ensure comfort and well-being in daily life.
                  </p>
                  
                  <div className="bg-[#fef6f9] p-6 rounded-2xl inline-block border-2 border-[#f4c9c8]/30">
                    <p className="text-gray-700 mb-4 font-medium">For more details, please reach out to us at</p>
                    <div className="flex items-center justify-center gap-3">
                      <div className="bg-[#a98cc8] p-3 rounded-full">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <a 
                        href="tel:+919876543210" 
                        className="text-2xl font-bold text-[#a98cc8] hover:text-[#9678b4] transition-colors duration-300"
                      >
                        +91 98765 43210
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

       

        {/* <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Frequently Asked Questions</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              Find answers to common questions about our therapy services for seniors.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-3">How do I know if therapy is right for me?</h3>
                <p className="text-gray-700">
                  Therapy can benefit anyone experiencing emotional challenges, life transitions, or simply seeking personal growth. Our initial consultation helps determine if our services match your needs.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-3">Can I use insurance to pay for sessions?</h3>
                <p className="text-gray-700">
                  Yes, we accept many insurance plans. During your initial consultation, we can verify your benefits and discuss payment options if insurance doesn't cover our services.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-3">How long do therapy sessions last?</h3>
                <p className="text-gray-700">
                  Standard sessions are 50 minutes, but we offer flexibility based on individual needs, including shorter sessions for those with limited stamina or concentration.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-3">Do you offer in-home therapy?</h3>
                <p className="text-gray-700">
                  Yes, we provide in-home sessions for clients with mobility issues. We also offer virtual therapy through our secure telehealth platform for maximum convenience.
                </p>
              </div>
            </div>
          </div>
        </section> */}
        
      </main>
      <SiteFooter />
    </div>
  );
}