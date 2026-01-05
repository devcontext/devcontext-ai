"use client";

import { LayoutDashboard, LayoutGrid, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationItem } from "./navigation-item";
import { appRoutes } from "@/features/routes";
import type {
  NavigationMenuProps,
  NavigationItem as NavigationItemType,
} from "./types";

const DEFAULT_ITEMS: NavigationItemType[] = [
  {
    label: "Overview",
    href: appRoutes.home.path,
    icon: LayoutDashboard,
  },
  {
    label: "Settings",
    href: appRoutes.settings.root.path,
    icon: Settings,
  },
];

export function NavigationMenu({
  items = DEFAULT_ITEMS,
  className,
}: NavigationMenuProps) {
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
