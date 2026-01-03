import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerCardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const PageContainerCard: React.FC<PageContainerCardProps> = ({
  title,
  description,
  children,
  footer,
  className,
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden",
        className,
      )}
    >
      {(title || description) && (
        <div className="p-6 pb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}

      {children && (
        <div className={cn("px-6", !title && !description && "pt-6")}>
          {children}
        </div>
      )}

      {footer && <div className="p-6 pt-4 border-t bg-muted/10">{footer}</div>}
    </div>
  );
};
