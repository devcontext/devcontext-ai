import type { Path } from "react-hook-form";

/**
 * Base props for all field components
 */
export interface BaseFieldProps<TFormData extends Record<string, any>> {
  /** Field name (path in form data) */
  name: Path<TFormData>;
  /** Field label */
  label?: string;
  /** Helper text */
  description?: string;
  /** Whether field is required */
  required?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Props for TextField component
 */
export interface TextFieldProps<TFormData extends Record<string, any>>
  extends
    BaseFieldProps<TFormData>,
    Omit<
      React.ComponentPropsWithoutRef<"input">,
      "name" | "id" | "aria-invalid" | "aria-describedby"
    > {
  type?: "text" | "email" | "password" | "tel" | "url" | "search";
}

/**
 * Props for TextareaField component
 */
export interface TextareaFieldProps<TFormData extends Record<string, any>>
  extends
    BaseFieldProps<TFormData>,
    Omit<
      React.ComponentPropsWithoutRef<"textarea">,
      "name" | "id" | "aria-invalid" | "aria-describedby"
    > {}

/**
 * Union type for FormField props
 */
export type FormFieldProps<TFormData extends Record<string, any>> =
  | (TextFieldProps<TFormData> & {
      type?: "text" | "email" | "password" | "tel" | "url" | "search";
    })
  | (TextareaFieldProps<TFormData> & { type: "textarea" });
