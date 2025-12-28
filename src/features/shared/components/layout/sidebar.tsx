"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, FilePlus, Settings, Database, FolderPlus } from "lucide-react"
import { cn } from "@/lib/utils"

import { ThemeToggle } from "./theme-toggle"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  return (
    <div className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col h-full hidden md:flex fixed left-0 top-0">
      {/* Brand */}
      <Link 
        href="/dashboard/contexts" 
        className="h-16 flex items-center px-6 border-b border-sidebar-border hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-primary/20">
          <Database className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-sidebar-foreground tracking-tight">Context AI</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Core Features */}
        <div className="pb-4">
          <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3 px-3">
            Platform
          </h3>
          
          <Link 
            href="/dashboard/contexts" 
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive("/dashboard/contexts") 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            Context Store
          </Link>

          <Link 
            href="/dashboard/composer" 
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive("/dashboard/composer") 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <FilePlus className="w-4 h-4" />
            Composer
          </Link>
        </div>

        {/* Configuration */}
        <div>
          <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3 px-3">
            Configuration
          </h3>
          
          <div className="group cursor-not-allowed opacity-60">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/50">
              <Settings className="w-4 h-4" />
              Settings
            </div>
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center text-xs font-bold text-sidebar-foreground">
            DV
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-sidebar-foreground">Dev User</span>
            <span className="text-[10px] text-sidebar-foreground/70">Local</span>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </div>
  )
}
