import { NextResponse } from "next/server";

/**
 * Utility to create a JSON response with CORS headers.
 * Standardizes headers for MCP clients (web-based and local).
 */
export function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, x-access-token",
      "Access-Control-Max-Age": "86400",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
