import { Logo } from "./logo";
import { ProjectSelector } from "./project-selector/project-selector";
import { HeaderRight } from "./header-right/header-right";
import { Menu } from "lucide-react";
import { Button } from "@/features/shared/ui/button";
import { useApp } from "@/features/shared/providers/app-provider";

export function Header() {
  const {
    ui: { setIsMobileMenuOpen },
  } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Logo />

          <div className="hidden md:block h-6 w-px bg-border/60 mx-1" />

          <div className="hidden md:block">
            <ProjectSelector />
          </div>
        </div>

        <HeaderRight />
      </div>
    </header>
  );
}
