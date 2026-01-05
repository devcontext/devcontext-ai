"use client";

import {
  LayoutDashboard,
  Settings,
  Layers2,
  PlusSquare,
  FolderKanban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationItem } from "./navigation-item";
import { appRoutes } from "@/features/routes";
import { useParams } from "next/navigation";
import type {
  NavigationMenuProps,
  NavigationItem as NavigationItemType,
} from "./types";

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  items,
  className,
}) => {
  const { projectSlug } = useParams<{ projectSlug?: string }>();

  // Helper to generate menu items based on context
  const getMenuItems = (): NavigationItemType[] => {
    if (items) return items;

    const baseItems: NavigationItemType[] = [
      {
        label: "Overview",
        href: appRoutes.home.path,
        icon: LayoutDashboard,
        order: 0,
      },
      {
        label: "Projects",
        href: appRoutes.projects.list.path,
        icon: FolderKanban,
        order: 10,
      },
    ];

    const settingsItem: NavigationItemType = {
      label: "Settings",
      href: appRoutes.settings.root.path,
      icon: Settings,
      order: 100,
    };

    if (!projectSlug) {
      return [...baseItems, settingsItem];
    }

    // Project-specific items
    const projectItems: NavigationItemType[] = [
      {
        label: "Contexts",
        href: appRoutes.contexts.list.generatePath({ projectSlug }),
        icon: Layers2,
        order: 1,
      },
      {
        label: "Composer",
        href: appRoutes.contexts.composer.generatePath({ projectSlug }),
        icon: PlusSquare,
        order: 2,
      },
    ];

    return [...projectItems, settingsItem];
  };

  const menuItems = getMenuItems().sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  return (
    <nav
      className={cn(
        "border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
        className,
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-1 px-6">
        {menuItems.map((item) => (
          <NavigationItem key={item.href} item={item} />
        ))}
      </div>
    </nav>
  );
};
