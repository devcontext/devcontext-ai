import { NextResponse } from "next/server";
import { requireApiKey } from "@/features/shared/lib/mcp-auth";
import { listMcpResources } from "@/features/core/app/mcp/list-mcp-resources";

/**
 * MCP resources/list API Route
 *
 * Returns the list of available contexts for the authenticated user
 * in the format expected by MCP clients.
 */
export async function GET(request: Request) {
  try {
    // 1. Validate Auth
    const { userId } = await requireApiKey(request);

    // 2. Fetch Resources
    const { resources } = await listMcpResources(userId);

    // 3. Return MCP-compatible response
    // Using simple result object as this is an HTTP endpoint
    return NextResponse.json({
      resources,
    });
  } catch (error: any) {
    const status =
      error.message === "Missing API Key" || error.message === "Invalid API Key"
        ? 401
        : 500;
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status },
    );
  }
}

/**
 * Support POST for clients that prefer it (MCP standard often uses JSON-RPC over POST)
 */
export async function POST(request: Request) {
  return GET(request);
}
