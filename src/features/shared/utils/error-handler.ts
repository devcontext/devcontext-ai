import { DomainError, isDomainError } from "@/features/core/domain/errors";
import { ApiResponse } from "../types/api-response";

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
