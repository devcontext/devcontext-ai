"use client";

import { TextField } from "../fields/text-field";
import { TextareaField } from "../fields/textarea-field";
import type { FormFieldProps } from "./types";

/**
 * FormField: Universal field dispatcher
 *
 * Routes to appropriate field component based on type.
 * Fallback to TextField for unknown types.
 */
export function FormField<TFormData extends Record<string, any>>(
  props: FormFieldProps<TFormData>,
) {
  const { type = "text" } = props as any;

  // Textarea
  if (type === "textarea") {
    return <TextareaField {...(props as any)} />;
  }

  // Text inputs (text, email, password, tel, url, search)
  if (
    type === "text" ||
    type === "email" ||
    type === "password" ||
    type === "tel" ||
    type === "url" ||
    type === "search"
  ) {
    return <TextField {...(props as any)} type={type} />;
  }

  // Fallback to text field
  return <TextField {...(props as any)} />;
}
