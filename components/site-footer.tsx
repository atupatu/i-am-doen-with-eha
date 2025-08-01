// import Link from "next/link"
// import { Heart } from "lucide-react"

// export default function SiteFooter() {
//   return (
//     <footer className="bg-[#a98cc8]/10 py-12">
//       <div className="container">
//         <div className="grid gap-8 md:grid-cols-4">
//           <div>
//             <div className="flex items-center gap-2 mb-4">
//               <Heart className="h-6 w-6 text-[#a98cc8]" />
//               <span className="text-xl font-semibold text-[#a98cc8]">Echoing Healthy Ageing</span>
//             </div>
//             <p className="text-gray-600">Providing compassionate mental health care for a better tomorrow.</p>
//           </div>
//           <div>
//             <h3 className="font-semibold mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="/" className="text-gray-600 hover:text-[#a98cc8]">
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/client/therapists" className="text-gray-600 hover:text-[#a98cc8]">
//                   Therapists
//                 </Link>
//               </li>
//               <li>
//                 <Link href="client/info" className="text-gray-600 hover:text-[#a98cc8]">
//                   Info
//                 </Link>
//               </li>
//               <li>
//                 <Link href="client/schedule" className="text-gray-600 hover:text-[#a98cc8]">
//                   Schedule
//                 </Link>
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="font-semibold mb-4">Resources</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-[#a98cc8]">
//                   Blog
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-[#a98cc8]">
//                   FAQ
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-[#a98cc8]">
//                   Privacy Policy
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-[#a98cc8]">
//                   Terms of Service
//                 </Link>
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="font-semibold mb-4">Contact</h3>
//             <ul className="space-y-2">
//               <li className="text-gray-600">info@echoinghealthyageing.com</li>
//               <li className="text-gray-600">(+91) 9867832665 / (+91) 9158656665</li>
//               <li className="text-gray-600">Deccan House, behind DDecor Showroom, Patkar Blocks, Bandra West, Mumbai, Maharashtra 400050</li>
//             </ul>
//           </div>
//         </div>
//         <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
//           <p>&copy; {new Date().getFullYear()} Echoing Healthy Ageing. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   )
// }

"use client"
import { useState } from "react"
import Link from "next/link"
import { Heart, X } from "lucide-react"

export default function SiteFooter() {
  const [showTermsModal, setShowTermsModal] = useState(false)

  const openTermsModal = () => setShowTermsModal(true)
  const closeTermsModal = () => setShowTermsModal(false)

  return (
    <>
      <footer className="bg-[#a98cc8]/10 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-[#a98cc8]" />
                <span className="text-xl font-semibold text-[#a98cc8]">Echoing Healthy Aging</span>
              </div>
              <p className="text-gray-600">Providing compassionate mental health care for a better tomorrow.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="gap-y-2" style={{display: 'grid', gridTemplateColumns: 'auto auto', columnGap: '60px', justifyContent: 'start'}}>
                <li>
                  <Link href="/" className="text-gray-600 hover:text-[#a98cc8]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/client/therapists" className="text-gray-600 hover:text-[#a98cc8]">
                    Therapists
                  </Link>
                </li>
                <li>
                  <Link href="/client/services" className="text-gray-600 hover:text-[#a98cc8]">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/client/schedule" className="text-gray-600 hover:text-[#a98cc8]">
                    Schedule
                  </Link>
                </li>
                <li>
                  <Link href="/client/about" className="text-gray-600 hover:text-[#a98cc8]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/client/contact" className="text-gray-600 hover:text-[#a98cc8]">
                    Contact Us
                  </Link>
                </li>
              </ul>

            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-600">E: info@echoinghealthyageing.com</li>
                <li className="text-gray-600">Neeta Ramakrishnan: <br />(+91) 98678 32665</li>
                <li className="text-gray-600">Amrita Patil: <br />(+91) 9167 613665</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Terms & Conditions</h3>
              <div className="text-gray-600 text-sm space-y-2">
                <p><strong>Session Invoicing:</strong> Advance payment system. All services are prepaid, monthly basis.</p>
                <p><strong>Payment Modes:</strong> Bank Transfer / UPI / Credit Card / Cash</p>
                <p><strong>Visit Days:</strong> Monday to Fridays, 10 am to 6 pm (Except Public holidays)</p>
                <button 
                  onClick={openTermsModal}
                  className="text-[#a98cc8] font-medium hover:underline block mt-2 cursor-pointer"
                >
                  View full terms and conditions
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Echoing Healthy Aging. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeTermsModal}
          />
          
          {/* Modal Card */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#a98cc8]/10 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Program Terms and Conditions</h2>
              <button
                onClick={closeTermsModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="text-gray-600 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Session Cancellation Policy:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>If cancellation is received at least 12 hours before session time with reason, no fee will be charged and session will be rescheduled</li>
                    <li>If cancellation is received less than 12 hours before, Rs.500 cancellation fee applies</li>
                    <li>If no communication is received until team member reaches client's doorstep, session will not be rescheduled and amount will not be refunded</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Other Policies:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Service can be terminated by either party on two weeks' notice</li>
                    <li>Rescheduling of sessions requires mutual convenience of service user and facilitator</li>
                    <li>Toolkits for sessions will be provided by EHA team</li>
                    <li>Outings and related visit costs (travel, eating out) will be borne by service user</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Payment & Billing:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Session Invoicing:</strong> Advance payment system. All services are prepaid, monthly basis.</li>
                    <li><strong>Payment Modes:</strong> Bank Transfer / UPI / Credit Card / Cash</li>
                    <li><strong>Visit Days:</strong> Monday to Fridays, 10 am to 6 pm (Except Public holidays)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              {/* <button
                onClick={closeTermsModal}
                className="bg-[#a98cc8] hover:bg-[#9678b4] text-white px-6 py-2 rounded-lg transition-colors"
              >
                Close
              </button> */}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
