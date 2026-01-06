/**
 * MCP Protocol Constants
 */
export const MCP_VERSION = "2024-11-05";
export const JSONRPC_VERSION = "2.0";

/**
 * MCP Methods
 */
export const MCP_METHODS = {
  INITIALIZE: "initialize",
  RESOURCES_LIST: "resources/list",
  RESOURCES_READ: "resources/read",
  TOOLS_LIST: "tools/list",
  TOOLS_CALL: "tools/call",
} as const;

/**
 * MCP Error Codes (JSON-RPC Compliant)
 */
export const MCP_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
} as const;

/**
 * Server Metadata
 */
export const SERVER_INFO = {
  name: "DevContext AI Server",
  version: "1.0.0",
};
