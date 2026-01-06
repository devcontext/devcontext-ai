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
    <div className="border-b px-4 border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-8" aria-label="Settings tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                isActive
                  ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                  : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-100",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
