"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, FilePlus, Settings, Database, FolderPlus } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  return (
    <div className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full hidden md:flex fixed left-0 top-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-900/20">
          <Database className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-white tracking-tight">Context AI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Core Features */}
        <div className="pb-4">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-3">
            Platform
          </h3>
          
          <Link 
            href="/dashboard/contexts" 
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive("/dashboard/contexts") 
                ? "bg-blue-600/10 text-blue-400" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
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
                ? "bg-blue-600/10 text-blue-400" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            )}
          >
            <FilePlus className="w-4 h-4" />
            Composer
          </Link>
        </div>

        {/* Configuration */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-3">
            Configuration
          </h3>
          
          <div className="group cursor-not-allowed opacity-60">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500">
              <Settings className="w-4 h-4" />
              Settings
            </div>
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">
            DV
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-white">Dev User</span>
            <span className="text-[10px] text-zinc-500">Local Environment</span>
          </div>
        </div>
      </div>
    </div>
  )
}
