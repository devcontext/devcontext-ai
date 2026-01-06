"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/features/shared/ui/input";
import { FieldWrapper } from "../form-field/field-wrapper";
import type { TextFieldProps } from "../form-field/types";

/**
 * TextField: Text input field with full a11y and RHF integration
 *
 * Supports: text, email, password, tel, url, search
 */
export function TextField<TFormData extends Record<string, any>>({
  name,
  label,
  description,
  required,
  className,
  type = "text",
  ...inputProps
}: TextFieldProps<TFormData>) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<TFormData>();

  const fieldId = `field-${String(name)}`;
  const error = errors[name];
  const errorId = `${fieldId}-error`;
  const descriptionId = description ? `${fieldId}-description` : undefined;

  return (
    <FieldWrapper
      fieldId={fieldId}
      label={label}
      required={required}
      description={description}
      error={error as any}
      isSubmitting={isSubmitting}
      className={className}
    >
      <Input
        id={fieldId}
        type={type}
        aria-invalid={!!error}
        aria-describedby={
          [descriptionId, error ? errorId : null].filter(Boolean).join(" ") ||
          undefined
        }
        disabled={isSubmitting || inputProps.disabled}
        {...register(name)}
        {...inputProps}
      />
    </FieldWrapper>
  );
}
