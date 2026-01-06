"use client";

import { LayoutGrid, FilePlus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationItem } from "./navigation-item";
import type {
  NavigationMenuProps,
  NavigationItem as NavigationItemType,
} from "./types";
import { useCurrentProject } from "@/features/projects/providers/project-provider";

/**
 * Project-aware navigation that generates links based on current project slug
 */
export function ProjectNavigationMenu({ className }: NavigationMenuProps) {
  let projectSlug: string | null = null;

  try {
    const project = useCurrentProject();
    projectSlug = project.slug;
  } catch {
    // Not inside ProjectProvider - use global navigation
  }

  const items: NavigationItemType[] = projectSlug
    ? [
        {
          label: "Contexts",
          href: `/app/projects/${projectSlug}/contexts`,
          icon: LayoutGrid,
        },
        {
          label: "Composer",
          href: `/app/projects/${projectSlug}/composer`,
          icon: FilePlus,
        },
        {
          label: "Settings",
          href: "/app/settings",
          icon: Settings,
        },
      ]
    : [
        {
          label: "Projects",
          href: "/app/projects",
          icon: LayoutGrid,
        },
        {
          label: "Settings",
          href: "/app/settings",
          icon: Settings,
        },
      ];

  return (
    <nav
      className={cn(
        "border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
        className,
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-1 px-6">
        {items.map((item) => (
          <NavigationItem key={item.href} item={item} />
        ))}
      </div>
    </nav>
  );
}
