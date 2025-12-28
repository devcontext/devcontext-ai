import { NextRequest, NextResponse } from "next/server";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { requireApiKey } from "@/features/shared/lib/mcp-auth";
import { mcpExecute } from "@/features/core/app/mcp-execute";
import { listMcpResources } from "@/features/core/app/mcp/list-mcp-resources";
import { readMcpResource } from "@/features/core/app/mcp/read-mcp-resource";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Simple MCP HTTP Handler
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

    // Handle initialize
    if (method === "initialize") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
            resources: {},
          },
          serverInfo: {
            name: "DevContext AI Server",
            version: "1.0.0",
          },
        },
      });
    }

    // Handle tools/list
    if (method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: [
            {
              name: "execute_project_context",
              description:
                "Resolves project context and returns a specialized prompt/contract for AI agents.",
              inputSchema: {
                type: "object",
                properties: {
                  projectId: {
                    type: "string",
                    description: "The UUID of the project",
                  },
                  commandId: {
                    type: "string",
                    description:
                      "The command to execute (e.g., 'create-component', 'refactor')",
                  },
                  userInput: {
                    type: "string",
                    description: "The natural language input from the user",
                  },
                  target: {
                    type: "object",
                    properties: {
                      pathHint: { type: "string" },
                      files: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                  },
                  contextHints: {
                    type: "object",
                    properties: {
                      currentBranch: { type: "string" },
                      tool: {
                        type: "string",
                        enum: ["cursor", "chatgpt", "gemini", "unknown"],
                      },
                    },
                  },
                },
                required: ["projectId", "commandId", "userInput"],
              },
            },
          ],
        },
      });
    }

    // Handle tools/call
    if (method === "tools/call") {
      const { name, arguments: args } = params;

      if (name === "execute_project_context") {
        const result = await mcpExecute({
          projectId: args.projectId,
          commandId: args.commandId,
          userInput: args.userInput,
          target: args.target,
          contextHints: args.contextHints,
        });

        if (result.status === "blocked") {
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: `Execution blocked: ${result.blocked.reason}\\nDetails: ${result.blocked.details}`,
                },
              ],
              isError: true,
            },
          });
        }

        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: result.contract.contractText,
              },
            ],
          },
        });
      }
    }

    // Handle resources/list
    if (method === "resources/list") {
      const { resources } = await listMcpResources(auth.userId);
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: { resources },
      });
    }

    // Handle resources/read
    if (method === "resources/read") {
      const { uri } = params;
      const { contents } = await readMcpResource(auth.userId, uri);
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: { contents },
      });
    }

    // Method not found
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
      },
      { status: 200 }, // JSON-RPC errors use 200 status
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
