import { ZodError } from "zod";
import { DomainError, isDomainError } from "@/features/core/domain/errors";
import { ApiResponse } from "../types/api-response";

/**
 * Maps Zod issues to a simple Record<field, message>
 */
export function validationErrorResponse<T>(error: ZodError): ApiResponse<T> {
  const fieldErrors: Record<string, string> = {};

  error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) {
      fieldErrors[path] = issue.message;
    }
  });

  return {
    success: false,
    error: "Validation failed",
    fieldErrors,
  };
}

/**
 * Centralized error handler for Server Actions.
 * Converts domain errors to UI-safe messages and masks unexpected errors.
 * (Data Fetching Rule #16, #25)
 */
export function handleErrorResponse(error: unknown): ApiResponse {
  // 1. If it's a controlled DomainError, we can expose its message and code
  if (isDomainError(error)) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  // 2. Log unexpected errors for debugging (Server side only)
  console.error("[Action Error]:", error);

  // 3. Return a generic message for anything else to avoid leaking internal info
  return {
    success: false,
    error: "An unexpected error occurred. Please try again later.",
    code: "UNEXPECTED_ERROR",
  };
}

/**
 * Helper to return an error response with a manual message
 */
export function errorResponse<T>(message: string): ApiResponse<T> {
  return {
    success: false,
    data: undefined,
    error: message,
  };
}

/**
 * Helper to return a successful ApiResponse
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}
