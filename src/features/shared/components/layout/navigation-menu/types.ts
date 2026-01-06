import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  order?: number;
  label: string;
  href: string;
  icon?: LucideIcon;
  sidebar?: boolean;
}

export interface NavigationMenuProps {
  items?: NavigationItem[];
  className?: string;
}
