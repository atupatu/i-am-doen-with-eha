"use client"
import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { ArrowRight, Calendar, Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import TestimonialCarousel from "@/components/testimonial-carousel"
import TherapistGrid from "@/components/therapist-grid"
import Navbar from "@/components/navbar";
import HowItWorks from "@/components/how-it-works"
import { Clock } from "lucide-react";
import StatCard from "@/components/stat-card"
import SiteFooter from "@/components/site-footer"

export default function Home() {
  const scheduleRef = useRef(null)

  const handleScrollToSchedule = () => {
    if (scheduleRef.current) {
      scheduleRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/*<section className="relative bg-gradient-to-b from-[#fef6f9] to-white py-20 md:py-32">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-gray-800">
                  Find your path to <span className="text-[#a98cc8]">inner peace</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-md">
                  Connect with compassionate therapists who can guide you through life's challenges with understanding
                  and expertise.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signin" passHref>
                    <Button
                      onClick={handleScrollToSchedule}
                      className="bg-[#a98cc8] hover:bg-[#9678b4] text-white px-8 py-6 rounded-xl text-lg"
                    >
                      Book Your Session
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-[#a98cc8] text-[#a98cc8] hover:bg-[#fef6f9] px-8 py-6 rounded-xl text-lg"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/landing3.png"
                  alt="Peaceful counseling session"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
  </section>*/}

         
        <section className="relative bg-gradient-to-b from-[#fef6f9] to-white min-h-screen flex items-center py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/landing3.png"
              alt="Peaceful counseling session"
              fill
              className="object-cover opacity-60"
            />
          </div>
          <div className="relative z-10 container">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-gray-800">
                  Find your path to <br /> <span className="text-[#a98cc8]">inner peace</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-md">
                  Connect with compassionate therapists who <br/>can guide you through life's challenges with understanding
                  and expertise.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signin" passHref>
                    <Button
                      onClick={handleScrollToSchedule}
                      className="bg-[#a98cc8] hover:bg-[#9678b4] text-white px-8 py-6 rounded-xl text-lg"
                    >
                      Book Your Session
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
       

        <HowItWorks />

        <section className="py-16 bg-[#f9f4ff]">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Clients Say</h2>
            <TestimonialCarousel />
          </div>
        </section>

        <section className="py-16 bg-[#fef6f9]/50">
          <div className="container">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Therapists</h2>
              <p className="text-gray-600 max-w-2xl">
                Our team of licensed professionals is here to provide personalized care tailored to your unique needs.
              </p>
            </div>
            <TherapistGrid />
            <div className="mt-12 text-center">
              <Link href="/therapists">
                <Button className="bg-[#a98cc8] hover:bg-[#9678b4] text-white px-8 rounded-xl">
                  View All Therapists <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Impact</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                See the difference we're making in the lives of seniors across the country.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                icon={<Star className="h-8 w-8 text-[#9678b4]" />}
                endValue={4.9}
                suffix="/5"
                label="Average client satisfaction rating"
              />
              <StatCard 
                icon={<Calendar className="h-8 w-8 text-[#9678b4]" />}
                endValue={1200}
                prefix="+"
                label="Monthly sessions with seniors"
              />
              <StatCard 
                icon={<Heart className="h-8 w-8 text-[#9678b4]" />}
                endValue={92}
                suffix="%"
                label="Report improved well-being"
              />
              <StatCard 
                icon={<Clock className="h-8 w-8 text-[#9678b4]" />}
                endValue={24}
                suffix="/7"
                label="Support available for our clients"
              />
            </div>
          </div>
        </section>

        <section ref={scheduleRef} className="py-16 bg-[#fef6f9]/50">
  <div className="container">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Begin Your Healing Journey Today</h2>
      <p className="text-gray-600">Take the first step towards a healthier mind and a more fulfilling life.</p>
    </div>
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg max-w-xl mx-auto text-center">
      <h3 className="text-xl font-semibold mb-4">Book Your First Session</h3>
      <p className="text-gray-600 mb-6">
        Schedule a consultation with one of our therapists and start your journey to wellness.
      </p>
      <Link href="./account" passHref>
        <Button className="w-full bg-[#a98cc8] hover:bg-[#9678b4] text-white rounded-xl py-6">
          Book Now
        </Button>
      </Link>
    </div>
  </div>
</section>

      </main>

      <SiteFooter />
    </div>
  )
} 