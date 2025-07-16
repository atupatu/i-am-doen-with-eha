"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Calendar, CreditCard, FileText, Home, LayoutDashboard, Phone, Users, UserCog } from "lucide-react"

import { cn } from "@/lib/utils"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-[#a98cc8]",
  },
  {
    label: "Clients",
    icon: Users,
    href: "/admin/clients",
    color: "text-[#a98cc8]",
  },
  {
    label: "Therapists",
    icon: UserCog,
    href: "/admin/therapists",
    color: "text-[#a98cc8]",
  },
  {
    label: "Assignments",
    icon: Calendar,
    href: "/admin/assignments",
    color: "text-[#a98cc8]",
  },
  {
    label: "Sessions",
    icon: FileText,
    href: "/admin/sessions",
    color: "text-[#a98cc8]",
  },
  {
    label: "Payments",
    icon: CreditCard,
    href: "/admin/payments",
    color: "text-[#a98cc8]",
  },
  {
    label: "Call Requests",
    icon: Phone,
    href: "/admin/call-requests",
    color: "text-[#a98cc8]",
  },
  {
    label: "Statistics",
    icon: BarChart3,
    href: "/admin/statistics",
    color: "text-[#a98cc8]",
  },
  {
    label: "Website",
    icon: Home,
    href: "/",
    color: "text-[#a98cc8]",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin" className="flex items-center pl-3 mb-8">
          <div className="relative w-8 h-8 mr-4">
            <LayoutDashboard className="h-8 w-8 text-[#a98cc8]" />
          </div>
          <h1 className="text-xl font-bold text-[#a98cc8]">Admin Portal</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-[#a98cc8] hover:bg-[#fef6f9] rounded-lg transition",
                pathname === route.href ? "text-[#a98cc8] bg-[#fef6f9]" : "text-zinc-600",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
