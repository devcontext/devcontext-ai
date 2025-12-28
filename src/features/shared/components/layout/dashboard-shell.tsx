"use client"

import { Sidebar } from "./sidebar"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/features/shared/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on navigation
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-blue-500/30">
      {/* Desktop Sidebar (Fixed) */}
      <Sidebar />

      {/* Mobile Header */}
      <div className="md:hidden h-16 border-b border-zinc-800 flex items-center px-4 bg-zinc-950 sticky top-0 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r border-zinc-800 w-64 bg-zinc-950">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <span className="ml-3 font-bold text-white tracking-tight">Context AI</span>
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  )
}
