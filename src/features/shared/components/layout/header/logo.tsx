import Link from "next/link";
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { appRoutes } from "@/features/routes";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className, href = appRoutes.home.path }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 hover:opacity-80 transition-opacity",
        className,
      )}
    >
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
        <Database className="w-5 h-5 text-primary-foreground" />
      </div>
      <span className="font-bold text-foreground tracking-tight">
        Context AI
      </span>
    </Link>
  );
}
