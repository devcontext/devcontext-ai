"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/features/shared/ui/textarea";
import { FieldWrapper } from "../form-field/field-wrapper";
import type { TextareaFieldProps } from "../form-field/types";

/**
 * TextareaField: Multiline text input with RHF integration
 */
export function TextareaField<TFormData extends Record<string, any>>({
  name,
  label,
  description,
  required,
  className,
  ...textareaProps
}: TextareaFieldProps<TFormData>) {
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
      <Textarea
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={
          [descriptionId, error ? errorId : null].filter(Boolean).join(" ") ||
          undefined
        }
        disabled={isSubmitting || textareaProps.disabled}
        {...register(name)}
        {...textareaProps}
      />
    </FieldWrapper>
  );
}
