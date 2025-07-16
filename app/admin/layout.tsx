import type React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <div className="h-full flex">
        <div className="hidden lg:flex h-full w-64 flex-col fixed inset-y-0 z-50">
          <AdminSidebar />
        </div>
        <main className="lg:pl-64 h-full w-full">{children}</main>
      </div>
    </div>
  )
}
