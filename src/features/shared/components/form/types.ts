import type { FieldError, Path, UseFormReturn } from "react-hook-form";

/**
 * Generic action response type for server actions
 */
export type ActionResult<TData = unknown, TField extends string = string> =
  | { ok: true; message?: string; data?: TData }
  | { ok: false; error: string; fieldErrors?: Partial<Record<TField, string>> };

/**
 * Props for field wrapper component
 */
export interface FieldWrapperProps {
  /** Unique field ID */
  fieldId: string;
  /** Field label text */
  label?: string;
  /** Whether field is required */
  required?: boolean;
  /** Helper text shown below input */
  description?: string;
  /** Error from react-hook-form */
  error?: FieldError;
  /** Whether the form is submitting */
  isSubmitting?: boolean;
  /** Child input element */
  children: React.ReactNode;
  /** Additional className for wrapper */
  className?: string;
}

/**
 * Props for form wrapper component
 */
export interface FormWrapperProps<TFormData extends Record<string, any>> {
  /** React Hook Form methods */
  methods: UseFormReturn<TFormData>;
  /** Submit handler */
  onSubmit: (data: TFormData) => Promise<void> | void;
  /** Form children (fields, buttons, etc) */
  children: React.ReactNode;
  /** Optional className for form */
  className?: string;
  /** Global error message to display */
  globalError?: string | null;
  /** Success message to display */
  successMessage?: string | null;
}
