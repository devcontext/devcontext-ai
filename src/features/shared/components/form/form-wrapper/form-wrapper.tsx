"use client";

import { FormProvider } from "react-hook-form";
import { cn } from "@/features/shared/lib/utils";
import type { FormWrapperProps } from "../types";

/**
 * FormWrapper: Centralizes form structure and feedback
 *
 * Responsibilities:
 * - Provides FormProvider context
 * - Wraps form element with submit handler
 * - Displays global error/success messages
 * - Consistent spacing and styling
 */
export function FormWrapper<TFormData extends Record<string, any>>({
  methods,
  onSubmit,
  children,
  className,
  globalError,
  successMessage,
}: FormWrapperProps<TFormData>) {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
        noValidate
      >
        {/* Global success message */}
        {successMessage && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3">
            <p className="text-sm text-green-800 dark:text-green-200">
              {successMessage}
            </p>
          </div>
        )}

        {/* Global error message */}
        {globalError && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
            <p className="text-sm text-destructive">{globalError}</p>
          </div>
        )}

        {/* Form fields */}
        {children}
      </form>
    </FormProvider>
  );
}
