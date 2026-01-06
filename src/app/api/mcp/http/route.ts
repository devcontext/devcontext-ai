import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/features/mcp/utils/mcp-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { McpService } from "@/features/mcp/services/mcp-service";
import { corsResponse } from "@/features/mcp/utils/cors";
import { toMcpErrorResponse } from "@/features/mcp/utils/mcp-errors";
import {
  JSONRPC_VERSION,
  MCP_METHODS,
  MCP_VERSION,
  SERVER_INFO,
} from "@/features/mcp/constants";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Handle JSON-RPC 2.0 requests for Model Context Protocol
 */
export async function POST(request: NextRequest) {
  let jsonRpcId: string | number | null = null;

  try {
    // [RATE LIMITING]
    // Add rate limiting logic here in the future.
    // Recommended: Use an Upstash or Redis-based limiter per userId or IP.

    // Authenticate
    const auth = await requireAccessToken(request);

    // Parse JSON-RPC request
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return toMcpErrorResponse(
        { code: "PARSE_ERROR", message: "Invalid JSON" },
        null,
      );
    }

    const { method, params, id, jsonrpc } = body;
    jsonRpcId = id || null;

    if (jsonrpc !== JSONRPC_VERSION) {
      return toMcpErrorResponse(
        { code: "INVALID_REQUEST", message: "Invalid JSON-RPC version" },
        jsonRpcId,
      );
    }

    if (!method) {
      return toMcpErrorResponse(
        { code: "INVALID_REQUEST", message: "Missing method" },
        jsonRpcId,
      );
    }

    // Use Service pattern
    const mcpService = new McpService(supabaseAdmin);

    // Handle initialize
    if (method === MCP_METHODS.INITIALIZE) {
      return corsResponse({
        jsonrpc: JSONRPC_VERSION,
        id,
        result: {
          protocolVersion: MCP_VERSION,
          capabilities: {
            resources: {
              subscribe: false,
              listChanged: false,
            },
            tools: {
              listChanged: false,
            },
          },
          serverInfo: SERVER_INFO,
        },
      });
    }

    // Handle tools/list
    if (method === MCP_METHODS.TOOLS_LIST) {
      return corsResponse({
        jsonrpc: JSONRPC_VERSION,
        id,
        result: {
          tools: [
            {
              name: "get_context",
              description:
                "Retrieves the latest version of an AI context by its ID",
              inputSchema: {
                type: "object",
                properties: {
                  contextId: {
                    type: "string",
                    description: "The UUID of the context to retrieve",
                  },
                },
                required: ["contextId"],
              },
            },
          ],
        },
      });
    }

    // Handle tools/call
    if (method === MCP_METHODS.TOOLS_CALL) {
      const { name, arguments: args } = params || {};
      if (name === "get_context") {
        const { contextId } = args || {};
        if (!contextId) {
          return toMcpErrorResponse(
            { code: "INVALID_PARAMS", message: "Missing contextId" },
            id,
          );
        }
        const contents = await mcpService.readResource(
          auth.userId,
          `context://${contextId}`,
        );
        return corsResponse({
          jsonrpc: JSONRPC_VERSION,
          id,
          result: {
            content: [
              {
                type: "text",
                text: contents[0]?.text || "Context not found or empty",
              },
            ],
          },
        });
      }
    }

    // Handle resources/list
    if (method === MCP_METHODS.RESOURCES_LIST) {
      const resources = await mcpService.listResources(auth.userId);
      return corsResponse({
        jsonrpc: JSONRPC_VERSION,
        id,
        result: { resources },
      });
    }

    // Handle resources/read
    if (method === MCP_METHODS.RESOURCES_READ) {
      const { uri } = params || {};
      if (!uri) {
        return toMcpErrorResponse(
          { code: "INVALID_PARAMS", message: "Missing resource URI" },
          id,
        );
      }
      const contents = await mcpService.readResource(auth.userId, uri);
      return corsResponse({
        jsonrpc: JSONRPC_VERSION,
        id,
        result: { contents },
      });
    }

    // Method not found or not supported
    return toMcpErrorResponse(
      { code: "METHOD_NOT_FOUND", message: `Method not found: ${method}` },
      id,
    );
  } catch (error: any) {
    return toMcpErrorResponse(error, jsonRpcId);
  }
}

/**
 * Handle OPTIONS for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, x-access-token",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/**
 * Handle GET requests for server info/health check
 */
export async function GET() {
  return corsResponse({
    ...SERVER_INFO,
    protocol: MCP_VERSION,
    transport: "http",
  });
}
