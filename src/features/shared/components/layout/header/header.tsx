import { Logo } from "./logo";
import { ProjectSelector } from "./project-selector/project-selector";
import { HeaderRight } from "./header-right/header-right";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Logo />
          <div className="h-6 w-px bg-border" />
          <ProjectSelector />
        </div>

        <HeaderRight />
      </div>
    </header>
  );
}
