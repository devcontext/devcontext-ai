import type { Path, UseFormSetError } from "react-hook-form";

/**
 * Applies field errors from server action to react-hook-form
 *
 * @example
 * const result = await createProject(data);
 * if (!result.ok && result.fieldErrors) {
 *   applyActionErrors({ setError, fieldErrors: result.fieldErrors });
 * }
 */
export function applyActionErrors<TFormData extends Record<string, any>>({
  setError,
  fieldErrors,
}: {
  setError: UseFormSetError<TFormData>;
  fieldErrors: Partial<Record<string, string>>;
}): void {
  Object.entries(fieldErrors).forEach(([field, message]) => {
    if (message) {
      setError(field as Path<TFormData>, {
        type: "manual",
        message,
      });
    }
  });
}
