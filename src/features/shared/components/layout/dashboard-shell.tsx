"use client";

import { Sidebar } from "./sidebar";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/features/shared/ui/sheet";
import { Button } from "@/features/shared/ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Desktop Sidebar (Fixed) */}
      <Sidebar />

      {/* Mobile Header */}
      <div className="md:hidden h-16 border-b border-border flex items-center px-4 bg-background sticky top-0 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 border-r border-sidebar-border w-64 bg-sidebar"
          >
            <Sidebar />
          </SheetContent>
        </Sheet>
        <span className="ml-3 font-bold text-foreground tracking-tight">
          Context AI
        </span>
      </div>

      {/* Main Content Area */}
      <main className="md:pl-64 min-h-screen flex flex-col">{children}</main>
    </div>
  );
}
