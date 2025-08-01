"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, Brain, Users, Sparkles, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
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


 return (
 <div className="flex min-h-screen flex-col">
 <Navbar />
 <main className="flex-1">

 {/* Full Height Landing Section */}
 <section className="min-h-screen bg-[#fef6f9] flex items-center">
 <div className="container">
 <div className="grid gap-12 md:grid-cols-2 items-center">
 <div>
 <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Approach to Mental Wellness</h2>
 <p className="text-gray-600 mb-6">
 At Echoing Healthy Aging, we believe in a holistic approach to mental health. We understand that each person's
 journey is unique, and we tailor our therapeutic approaches to meet your specific needs.
 </p>
 <ul className="space-y-4">
 <li className="flex items-start">
 <div className="bg-[#c8e6c9] rounded-full p-1 mr-3 mt-1">
 <svg className="h-4 w-4 text-[#a98cc8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 </div>
 <p className="text-gray-700">Personalized treatment plans based on your unique needs</p>
 </li>
 <li className="flex items-start">
 <div className="bg-[#c8e6c9] rounded-full p-1 mr-3 mt-1">
 <svg className="h-4 w-4 text-[#a98cc8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 </div>
 <p className="text-gray-700">Evidence-based therapeutic techniques</p>
 </li>
 <li className="flex items-start">
 <div className="bg-[#c8e6c9] rounded-full p-1 mr-3 mt-1">
 <svg className="h-4 w-4 text-[#a98cc8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 </div>
 <p className="text-gray-700">Compassionate, non-judgmental support</p>
 </li>
 <li className="flex items-start">
 <div className="bg-[#c8e6c9] rounded-full p-1 mr-3 mt-1">
 <svg className="h-4 w-4 text-[#a98cc8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 </div>
 <p className="text-gray-700">Ongoing progress assessment and plan adjustments</p>
 </li>
 </ul>
 <Link href="./signin" passHref>
 <Button className="mt-8 bg-[#a98cc8] hover:bg-[#9678b4] text-white px-8 py-6 rounded-xl">
 Book a Consultation
 </Button>
 </Link>
 </div>
 <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
 <Image
 src="/approach2.png?height=800&width=600"
 alt="Therapeutic session"
 fill
 className="object-cover"
 />
 </div>
 </div>
 </div>
 </section>

 {/* Dementia Care FAQ Section */}
 <section className="py-16 bg-[#fef6f9]">
 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
 <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Dementia Care Program</h2>
 <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
 Learn more about our specialized dementia care services and approaches.
 </p>

 <div className="max-w-4xl mx-auto">
 <div className="space-y-4">
 {dementiaFaqs.map((faq, index) => (
 <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
 <button
 className="w-full p-6 text-left flex justify-between items-center"
 onClick={() => toggleFaq(index)}
 >
 <h3 className="text-lg font-semibold">{faq.question}</h3>
 {openFaqIndex === index ? (
 <ChevronUp className="h-5 w-5 text-[#a98cc8]" />
 ) : (
 <ChevronDown className="h-5 w-5 text-[#a98cc8]" />
 )}
 </button>
 {openFaqIndex === index && (
 <div className="px-6 pb-6 pt-0 text-gray-700">
 {faq.answer}
 </div>
 )}
 </div>
 ))}
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