import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Navbar from "@/components/navbar";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef6f9] to-white">
      {/* Full-width navbar */}
      <Navbar/>
      
      {/* Main content with spacing below navbar */}
      <div className="pt-8 pb-12 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-gray-800 mb-4">
                Get in <span className="text-[#a98cc8]">Touch</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're here to support you on your journey to wellness. Reach out to us for any questions or to schedule your session.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-3xl shadow-lg">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
                  
                  {/* Company Name */}
                  <div className="mb-6">
                    <h3 className="text-xl font-medium text-[#a98cc8] mb-2">Echoing Healthy Ageing</h3>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="bg-[#fef6f9] p-3 rounded-xl">
                      <MapPin className="h-6 w-6 text-[#a98cc8]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Deccan House, behind DDecor Showroom,<br />
                        Patkar Blocks, Bandra West,<br />
                        Mumbai, Maharashtra 400050
                      </p>
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="bg-[#fef6f9] p-3 rounded-xl">
                      <Phone className="h-6 w-6 text-[#a98cc8]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Contact Numbers</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="font-medium text-gray-700">Neeta Ramakrishnan:</p>
                          <a href="tel:+919867832665" className="text-[#a98cc8] hover:text-[#9678b4] transition-colors">
                            (+91) 98678 32665
                          </a>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Amrita Patil:</p>
                          <a href="tel:+919167613665" className="text-[#a98cc8] hover:text-[#9678b4] transition-colors">
                            (+91) 9167 613665
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="bg-[#fef6f9] p-3 rounded-xl">
                      <Mail className="h-6 w-6 text-[#a98cc8]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                      <a 
                        href="mailto:info@echoinghealthyageing.com" 
                        className="text-[#a98cc8] hover:text-[#9678b4] transition-colors"
                      >
                        info@echoinghealthyageing.com
                      </a>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#fef6f9] p-3 rounded-xl">
                      <Clock className="h-6 w-6 text-[#a98cc8]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Business Hours</h4>
                      {/* <div className="text-gray-600 space-y-1">
                        <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                        <p>Saturday: 10:00 AM - 5:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div> */}
                    </div>
                  </div>
                </div>

              </div>

              {/* Interactive Map */}
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Find Us</h2>
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-md">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.2566347557887!2d72.82899431744384!3d19.0544472872845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9b4f3b4b4b7%3A0x4b4b4b4b4b4b4b4b!2sPatkar%20Blocks%2C%20Bandra%20West%2C%20Mumbai%2C%20Maharashtra%20400050!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Echoing Healthy Ageing Location"
                  ></iframe>
                </div>
                
                {/* Map Info */}
                <div className="mt-6 p-4 bg-[#fef6f9] rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">Getting Here</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Located in the heart of Bandra West, our office is easily accessible by public transport. 
                    The nearest railway station is Bandra, and we're just a short walk from the main road.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}