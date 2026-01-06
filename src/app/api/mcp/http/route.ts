import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "@/features/mcp/utils/mcp-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { McpService } from "@/features/mcp/services/mcp-service";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Simple MCP HTTP Handler (Read-Only MVP)
 *
 * Handles JSON-RPC 2.0 requests for Model Context Protocol
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate
    const auth = await requireApiKey(request);

    // Parse JSON-RPC request
    const body = await request.json();
    const { method, params, id } = body;

    // Use Service pattern
    const mcpService = new McpService(supabaseAdmin);

    // Handle initialize
    if (method === "initialize") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            resources: {},
            // tools: {}, // DISABLED for MVP compliance
          },
          serverInfo: {
            name: "DevContext AI Server",
            version: "1.0.0",
          },
        },
      });
    }

    // Handle tools/list (Compliant with Read-Only MVP: return empty list or error)
    if (method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: [],
        },
      });
    }

    // Handle resources/list
    if (method === "resources/list") {
      const resources = await mcpService.listResources(auth.userId);
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: { resources },
      });
    }

    // Handle resources/read
    if (method === "resources/read") {
      const { uri } = params;
      const contents = await mcpService.readResource(auth.userId, uri);
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: { contents },
      });
    }

    // Method not found or not supported in MVP
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32601,
          message: `Method not found or disabled in MVP: ${method}`,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    // Authentication or other errors
    if (error.message?.includes("API Key")) {
      return NextResponse.json(
        {
          error: "invalid_token",
          error_description: error.message,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: error.message || "Internal error",
        },
      },
      { status: 500 },
    );
  }
}

/**
 * Handle GET requests for server info/health check
 */
export async function GET() {
  return NextResponse.json({
    name: "DevContext AI MCP Server",
    version: "1.0.0",
    protocol: "2024-11-05",
    transport: "http",
  });
}
