"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { settingsRoutes } from "@/features/settings/routes";

interface Tab {
  id: string;
  label: string;
  href: string;
}

const tabs: Tab[] = [
  {
    id: "general",
    label: settingsRoutes.root.title,
    href: settingsRoutes.root.path,
  },
  {
    id: "access-tokens",
    label: settingsRoutes.accessTokens.title,
    href: settingsRoutes.accessTokens.path,
  },
];

export function SettingsTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6" aria-label="Settings tabs">
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href ||
          (tab.href !== settingsRoutes.root.path &&
            pathname?.startsWith(tab.href));

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "relative py-3 text-sm font-medium transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
