import { Button } from "@/features/shared/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface Action {
  text: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
}

export const EmptyStateActions = ({ actions }: { actions: Action[] }) => {
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      {actions.map((action) => {
        if (action.href) {
          return (
            <Button
              key={action.text}
              asChild
              size="lg"
              className="font-semibold"
              variant="default"
            >
              <Link href={action.href}>
                {action.icon && <action.icon className="w-4 h-4" />}
                {action.text}
              </Link>
            </Button>
          );
        }

        if (action.onClick) {
          return (
            <Button
              key={action.text}
              onClick={action.onClick}
              size="lg"
              className="font-semibold"
              variant="default"
            >
              {action.icon && <action.icon className="w-4 h-4" />}
              {action.text}
            </Button>
          );
        }

        return null;
      })}
    </div>
  );
};
