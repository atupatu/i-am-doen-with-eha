import Link from "next/link"
import Image from "next/image"
import { Heart, Brain, Users, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";

export default function InfoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-[#fef6f9] py-16 md:py-24">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl font-bold mb-6 text-gray-800">Our Therapeutic Approaches</h1>
              <p className="text-lg text-gray-600">
                At MindfulCare, we offer a variety of evidence-based therapeutic approaches tailored to your unique
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
                  It’s a practical way to feel better, especially if you're dealing with anxiety, stress, or depression.
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
                  and share moments with—especially helpful during big life changes or when you’re feeling isolated.
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
                  This therapy involves fun and engaging activities that boost memory and thinking skills. It’s ideal for those
                  facing memory challenges or simply looking to stay mentally active and energized.
                </p>

                <Link href="#" className="text-[#a98cc8] font-medium flex items-center hover:underline">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Approach to Mental Wellness</h2>
                <p className="text-gray-600 mb-6">
                  At MindfulCare, we believe in a holistic approach to mental health. We understand that each person's
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

         {/* FAQ Section Replacing Our Impact */}
         <section className="py-16 bg-[#fef6f9]">
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
        </section>
        {/* <section className="py-16 bg-[#fef6f9]/50">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Impact</h2>
              <p className="text-lg text-gray-600">
                We're proud of the positive change we've helped create in our clients' lives.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-4">
              <div className="bg-white p-8 rounded-3xl shadow-md text-center">
                <h3 className="text-4xl font-bold text-[#a98cc8] mb-2">94%</h3>
                <p className="text-gray-700">of clients report improved coping skills</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-md text-center">
                <h3 className="text-4xl font-bold text-[#a98cc8] mb-2">87%</h3>
                <p className="text-gray-700">experience reduced anxiety symptoms</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-md text-center">
                <h3 className="text-4xl font-bold text-[#a98cc8] mb-2">15,000+</h3>
                <p className="text-gray-700">therapy sessions conducted annually</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-md text-center">
                <h3 className="text-4xl font-bold text-[#a98cc8] mb-2">92%</h3>
                <p className="text-gray-700">client satisfaction rate</p>
              </div>
            </div>
          </div>
        </section> */}
      </main>
      <footer className="bg-[#a98cc8]/10 py-12">
        /*<div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-[#a98cc8]" />
                <span className="text-xl font-semibold text-[#a98cc8]">MindfulCare</span>
              </div>
              <p className="text-gray-600">Providing compassionate mental health care for a better tomorrow.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-[#a98cc8]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/therapists" className="text-gray-600 hover:text-[#a98cc8]">
                    Therapists
                  </Link>
                </li>
                <li>
                  <Link href="/info" className="text-gray-600 hover:text-[#a98cc8]">
                    Info
                  </Link>
                </li>
                <li>
                  <Link href="/schedule" className="text-gray-600 hover:text-[#a98cc8]">
                    Schedule
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#a98cc8]">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#a98cc8]">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#a98cc8]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#a98cc8]">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-600">contact@mindfulcare.com</li>
                <li className="text-gray-600">+1 (555) 123-4567</li>
                <li className="text-gray-600">123 Serenity Lane, Peaceful City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} MindfulCare. All rights reserved.</p>
          </div>
        </div>*/
        
      </footer>
    </div>
  )
}