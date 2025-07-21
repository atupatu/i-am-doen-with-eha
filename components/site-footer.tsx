import Link from "next/link"
import { Heart } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="bg-[#a98cc8]/10 py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-[#a98cc8]" />
              <span className="text-xl font-semibold text-[#a98cc8]">Echoing Healthy Ageing</span>
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
              <li className="text-gray-600">info@echoinghealthyageing.com</li>
              <li className="text-gray-600">(+91) 9867832665 / (+91) 9158656665</li>
              <li className="text-gray-600">Deccan House, behind DDecor Showroom, Patkar Blocks, Bandra West, Mumbai, Maharashtra 400050</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} MindfulCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
