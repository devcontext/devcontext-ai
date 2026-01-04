/**
 * Base class for all domain errors
 * (Data Fetching Rule #14-16)
 */
export class DomainError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly context?: Record<string, any>,
    public readonly field?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "NOT_FOUND", context);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = "Unauthorized", context?: Record<string, any>) {
    super(message, "UNAUTHORIZED", context);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = "Forbidden", context?: Record<string, any>) {
    super(message, "FORBIDDEN", context);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, field?: string, context?: Record<string, any>) {
    super(message, "VALIDATION_ERROR", context, field);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "CONFLICT", context);
  }
}

export class UnexpectedError extends DomainError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "UNEXPECTED_ERROR", context);
  }
}

// Type guards
export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}
