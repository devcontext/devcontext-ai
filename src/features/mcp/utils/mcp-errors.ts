import { JSONRPC_VERSION, MCP_ERROR_CODES } from "../constants";
import { isDomainError } from "../../core/domain/errors";
import { corsResponse } from "./cors";

interface McpError {
  code: number;
  message: string;
  data?: any;
}

/**
 * Error mapping for Domain Errors
 */
const DOMAIN_ERROR_MAP: Record<string, { status: number; code?: number }> = {
  UNAUTHORIZED: { status: 401 },
  FORBIDDEN: { status: 403 },
  NOT_FOUND: { status: 200, code: MCP_ERROR_CODES.INVALID_PARAMS },
};

/**
 * Error mapping for Protocol/Internal Errors
 */
const PROTOCOL_ERROR_MAP: Record<string, { code: number; status?: number }> = {
  PARSE_ERROR: { code: MCP_ERROR_CODES.PARSE_ERROR, status: 400 },
  INVALID_REQUEST: { code: MCP_ERROR_CODES.INVALID_REQUEST, status: 400 },
  METHOD_NOT_FOUND: { code: MCP_ERROR_CODES.METHOD_NOT_FOUND },
  INVALID_PARAMS: { code: MCP_ERROR_CODES.INVALID_PARAMS },
};

/**
 * Maps any error to a standardized MCP JSON-RPC error response.
 * Ensures no sensitive information is leaked unless explicitly intended.
 */
export function toMcpErrorResponse(
  error: unknown,
  id: string | number | null = null,
) {
  let code: number = MCP_ERROR_CODES.INTERNAL_ERROR;
  let message = "Internal server error";
  let status = 500;

  if (isDomainError(error)) {
    const mapping = DOMAIN_ERROR_MAP[error.code];
    status = mapping?.status ?? 500;
    message = error.message;
    if (mapping?.code) code = mapping.code;
  } else if (typeof error === "object" && error !== null && "code" in error) {
    const protocolErr = error as { code: string; message: string };
    const mapping = PROTOCOL_ERROR_MAP[protocolErr.code];

    message = protocolErr.message;
    status = mapping?.status ?? 200;
    if (mapping) code = mapping.code;
  } else if (error instanceof Error) {
    console.error(`[MCP] Unexpected error:`, error);
    message = "An unexpected error occurred. Please contact support.";
  }

  return corsResponse(
    {
      jsonrpc: JSONRPC_VERSION,
      id,
      error: { code, message },
    },
    status,
  );
}
