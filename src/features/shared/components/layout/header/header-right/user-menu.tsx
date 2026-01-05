"use client";

import { LogOut, Settings, LayoutDashboard, Command } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/ui/dropdown-menu";
import { ThemeToggle } from "../../theme-toggle";
import { appRoutes } from "@/features/routes";
import type { UserMenuProps } from "./types";

export function UserMenu({
  userName = "johndoe",
  userEmail = "johndoe@example.dev",
  userInitials,
  onLogout,
  onNavigate,
}: UserMenuProps) {
  const initials =
    userInitials ||
    userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleNavigate = (path: string) => {
    onNavigate?.(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg hover:bg-accent/50 transition-colors px-2 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
          {initials}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="px-3 py-2">
          <div className="font-medium">{userName}</div>
          <div className="text-xs text-muted-foreground">{userEmail}</div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2 cursor-pointer">
          <Command className="w-4 h-4" />
          Command Menu
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 flex items-center justify-between">
          <span className="text-sm">Theme</span>
          <ThemeToggle />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
