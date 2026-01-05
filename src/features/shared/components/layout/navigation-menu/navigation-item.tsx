"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavigationItem as NavigationItemType } from "./types";

interface NavigationItemProps {
  item: NavigationItemType;
  sidebar?: boolean;
  onClick?: () => void;
}

export function NavigationItem({
  item,
  sidebar,
  onClick,
}: NavigationItemProps) {
  const pathname = usePathname();
  const isActive =
    item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 transition-all px-3 py-2 text-[13px] font-medium rounded-md outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
        sidebar
          ? // Sidebar styles (Vertical) - Solid but Quiet
            cn(
              "w-full",
              isActive
                ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                : "text-muted-foreground/80 hover:text-foreground hover:bg-accent/40",
            )
          : // Header/Menu styles (Horizontal) - Minimal
            cn(
              "py-2",
              "hover:text-foreground/80",
              isActive
                ? "text-foreground after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-px after:bg-primary"
                : "text-muted-foreground/70",
            ),
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {Icon && (
        <Icon
          className={cn("w-3.5 h-3.5", isActive ? "opacity-100" : "opacity-60")}
        />
      )}
      {item.label}
    </Link>
  );
}
