"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs" // Import Supabase helper
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Calendar, Users, FileText, Settings, LogOut, Menu, X, Heart } from "lucide-react"

export default function TherapistSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient() // Create Supabase client instance
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = [
    // ... (your navItems array remains the same)
    {
      title: "Dashboard",
      href: "/therapist",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Schedule",
      href: "/therapist/schedule",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Clients",
      href: "/therapist/clients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Reports",
      href: "/therapist/reports",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Profile",
      href: "/therapist/profile",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  // Updated sign-out function for Supabase
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/') // Redirect to the login page after sign-out
    router.refresh() // Refresh the page to clear any cached user data
  }

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 md:hidden ${isMobileOpen ? "block" : "hidden"}`}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-white border-r transition-all duration-300 md:relative md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex flex-col h-full">
          {/* ... (Header and Navigation sections remain the same) */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/therapist" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-[#a98cc8]" />
              {!isCollapsed && <span className="text-xl font-semibold text-[#a98cc8]">Echoing Healthy Aging</span>}
            </Link>
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsCollapsed(!isCollapsed)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    pathname === item.href ? "bg-[#a98cc8]/10 text-[#a98cc8]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className={`w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 ${
                isCollapsed ? "px-2" : ""
              }`}
              onClick={handleSignOut} // The onClick handler calls our new function
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">Sign Out</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}