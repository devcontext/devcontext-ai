import { LayoutGrid, LucideIcon } from "lucide-react";

import { EmptyStateActions } from "@/features/shared/components/empty-state/empty-state-actions";
import { cn } from "@/features/shared/utils/tailwind-utils";

type ActionType = React.ComponentProps<typeof EmptyStateActions>;

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  fullHeight?: boolean;
  actions?: ActionType["actions"];
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  fullHeight = true,
  actions = [],
  children,
}) => {
  const Icon = icon || LayoutGrid;

  return (
    <div
      className={cn("flex items-center justify-center", {
        "flex-1": fullHeight,
      })}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6 ring-1 ring-border">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>

        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>

        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
          {description}
        </p>

        <EmptyStateActions actions={actions} />
        {children}
      </div>
    </div>
  );
};
