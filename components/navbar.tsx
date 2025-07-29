"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("userAuthenticated");
    const name = localStorage.getItem("userName");
    
    if (isAuthenticated === "true" && name) {
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userAuthenticated");
    localStorage.removeItem("userName");
    setUserName(null);
    window.location.href = "/";
  };

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        pathname === href ? "text-[#a98cc8]" : "text-gray-600 hover:text-[#a98cc8]"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-[#a98cc8]" />
          <span className="text-xl font-semibold text-[#a98cc8]">Echoing Healthy Ageing</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {navLink("/", "Home")}
          {navLink("/client/therapists", "Therapists")}
          {navLink("/client/info", "Info")}
          {navLink("/client/schedule", "Schedule")}
        </nav>
        <div className="flex items-center gap-4">
          {userName ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none hover:opacity-80 transition">
                  <UserCircle className="h-8 w-8 text-[#a98cc8]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 w-full">
                    <UserCircle className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link 
              href="/account" 
              className="px-4 py-2 rounded-full text-sm font-medium bg-[#a98cc8] text-white hover:bg-[#9678b4] transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
