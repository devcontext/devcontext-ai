"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Layers2,
  PlusSquare,
  FolderKanban,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/features/shared/providers/app-provider";
import { appRoutes } from "@/features/routes";
import { NavigationItem } from "./navigation-menu/navigation-item";
import { ProjectSelector } from "./header/project-selector/project-selector";

interface SidebarProps {
  isMobile?: boolean;
}

export function Sidebar({ isMobile }: SidebarProps) {
  const pathname = usePathname();
  const {
    projects: { activeProject },
    ui: { setIsMobileMenuOpen },
  } = useApp();

  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const platformItems = [
    {
      label: "Overview",
      href: appRoutes.home.path,
      icon: LayoutDashboard,
    },
    {
      label: "Projects",
      href: appRoutes.projects.list.path,
      icon: FolderKanban,
    },
    {
      label: "Settings",
      href: appRoutes.settings.root.path,
      icon: Settings,
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col bg-card",
        isMobile
          ? "w-full h-full"
          : "w-64 border-r h-[calc(100vh-4rem)] sticky top-16 hidden md:flex",
      )}
    >
      <div
        className={cn(
          "flex-1 flex flex-col gap-10",
          isMobile ? "py-6" : "py-8",
        )}
      >
        {/* Mobile Project Selector */}
        {isMobile && (
          <section className="px-6 pb-2">
            <div className="mb-4">
              <h2 className="text-[10px] font-bold tracking-widest text-muted-foreground/30 uppercase">
                Active Scope
              </h2>
            </div>
            <ProjectSelector fullWidth />
          </section>
        )}

        {/* Platform Section */}
        <section className="px-4">
          <div className="mb-4 px-2">
            <h2 className="text-[10px] font-bold tracking-widest text-muted-foreground/50 uppercase">
              Platform
            </h2>
          </div>
          <div className="space-y-1">
            {platformItems.map((item) => (
              <NavigationItem
                key={item.href}
                item={item}
                sidebar
                onClick={handleNavClick}
              />
            ))}
          </div>
        </section>

        {/* Project Section */}
        <section className="px-4">
          <div className="mb-4 px-2">
            <h2 className="text-[10px] font-bold tracking-widest text-muted-foreground/50 uppercase truncate">
              {activeProject ? `Project` : "Active Project"}
            </h2>
          </div>

          {activeProject ? (
            <div className="space-y-4">
              {/* Project Identity Card - Subtle & Indented */}
              <div className="ml-2 px-4 py-3 bg-primary/5 border border-primary/10 rounded-lg">
                <p className="text-xs font-semibold text-primary truncate">
                  {activeProject.name}
                </p>
                <p className="text-[10px] text-muted-foreground/60 truncate font-mono">
                  {activeProject.slug}
                </p>
              </div>

              {/* Scoped Items - Indented to show dependency */}
              <div className="ml-2 space-y-1">
                <NavigationItem
                  item={{
                    label: "Contexts",
                    href: appRoutes.contexts.list.generatePath({
                      projectSlug: activeProject.slug,
                    }),
                    icon: Layers2,
                  }}
                  sidebar
                  onClick={handleNavClick}
                />
                <NavigationItem
                  item={{
                    label: "Preferences",
                    href: appRoutes.projects.settings.generatePath({
                      projectSlug: activeProject.slug,
                    }),
                    icon: Settings,
                  }}
                  sidebar
                  onClick={handleNavClick}
                />
              </div>
            </div>
          ) : (
            <div className="ml-2 px-4 py-6 border border-dashed border-border/60 rounded-lg bg-muted/20">
              <p className="text-[11px] leading-relaxed text-muted-foreground/70 italic text-center">
                Select a project to manage its explicit contexts.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t bg-muted/5 mt-auto">
        <Link
          href="/"
          onClick={handleNavClick}
          className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold tracking-widest text-muted-foreground hover:text-foreground uppercase transition-colors"
        >
          <div className="w-4 h-4 rounded bg-foreground flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-background" />
          </div>
          Return Home
        </Link>
      </div>
    </aside>
  );
}
