import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface NavigationMenuProps {
  items?: NavigationItem[];
  className?: string;
}
