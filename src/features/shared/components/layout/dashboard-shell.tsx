"use client";

import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Sheet, SheetContent } from "@/features/shared/ui/sheet";
import { useApp } from "@/features/shared/providers/app-provider";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const {
    ui: { isMobileMenuOpen, setIsMobileMenuOpen },
  } = useApp();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col">
      {/* Top Header */}
      <Header />

      <div className="flex flex-1">
        {/* Persistent Sidebar (Vertical) - Desktop */}
        <Sidebar />

        {/* Mobile Menu - Side Drawer */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent
            side="left"
            className="p-0 border-r w-80 bg-background flex flex-col"
          >
            <div className="flex-1 overflow-y-auto">
              <Sidebar isMobile />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0 overflow-hidden">
          <div className="h-[calc(100vh-4rem)] overflow-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
