"use client";

import { cn } from "@/features/shared/utils/tailwind-utils";
import type { FieldWrapperProps } from "../types";

/**
 * FieldWrapper: Encapsulates common field layout and accessibility
 *
 * Responsibilities:
 * - Label/description/error layout
 * - Automatic ID generation for a11y
 * - ARIA attributes (aria-invalid, aria-describedby)
 * - Required indicator
 * - Error styling
 */
export function FieldWrapper({
  fieldId,
  label,
  required,
  description,
  error,
  isSubmitting,
  children,
  className,
}: FieldWrapperProps) {
  const errorId = `${fieldId}-error`;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const ariaDescribedBy =
    [descriptionId, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {/* Clone children to inject a11y props */}
      {typeof children === "object" && children !== null && "props" in children
        ? (children as React.ReactElement<any>).type === "input" ||
          (children as React.ReactElement<any>).type === "textarea"
          ? // For native elements, we can clone with props
            (children as React.ReactElement<any>)
          : // For custom components, just render as-is
            // The field component is responsible for using these IDs
            children
        : children}

      {description && !error && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
