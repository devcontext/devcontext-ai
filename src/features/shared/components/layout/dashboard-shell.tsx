"use client";

import { Header } from "./header";
import { NavigationMenu } from "./navigation-menu";
import { Sidebar } from "./sidebar";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/features/shared/ui/sheet";
import { Button } from "@/features/shared/ui/button";
import { useState } from "react";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* New Header */}
      <Header />

      {/* Navigation Menu */}
      <NavigationMenu />

      {/* Mobile Menu - Temporary fallback using old sidebar */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="rounded-full shadow-lg"
              aria-label="Open menu"
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
      </div>

      {/* Main Content Area */}
      <main className="min-h-screen flex flex-col">{children}</main>
    </div>
  );
}
