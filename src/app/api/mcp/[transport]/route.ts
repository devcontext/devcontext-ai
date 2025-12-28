import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import { requireApiKey } from "@/features/shared/lib/mcp-auth";
import { mcpExecute } from "@/features/core/app/mcp-execute";
import { listMcpResources } from "@/features/core/app/mcp/list-mcp-resources";
import { readMcpResource } from "@/features/core/app/mcp/read-mcp-resource";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Unified MCP Route Handler
 *
 * This handler leverages the official mcp-handler for Next.js, supporting
 * both HTTP and SSE transports, and providing a standardized way to expose
 * tools and resources to MCP clients (Cursor, Claude Desktop, etc.)
 */
const mcpHandler = createMcpHandler(
  (server) => {
    // ========== TOOLS ==========

    server.registerTool(
      "execute_project_context",
      {
        description:
          "Resolves project context and returns a specialized prompt/contract for AI agents.",
        inputSchema: z.object({
          projectId: z.string().describe("The UUID of the project"),
          commandId: z
            .string()
            .describe(
              "The command to execute (e.g., 'create-component', 'refactor')",
            ),
          userInput: z
            .string()
            .describe("The natural language input from the user"),
          target: z
            .object({
              pathHint: z.string().optional(),
              files: z.array(z.string()).optional(),
            })
            .optional(),
          contextHints: z
            .object({
              currentBranch: z.string().optional(),
              tool: z
                .enum(["cursor", "chatgpt", "gemini", "unknown"])
                .optional(),
            })
            .optional(),
        }),
      },
      async (args, extra) => {
        // Access auth from the request (injected by withMcpAuth)
        const request = (extra as any).request as Request;
        const auth = request?.auth as any;
        const apiKey = auth?.userData?.apiKey;

        if (!apiKey) {
          throw new Error("Unauthorized: API Key is required");
        }

        const result = await mcpExecute({
          projectId: args.projectId,
          commandId: args.commandId,
          userInput: args.userInput,
          target: args.target,
          contextHints: args.contextHints,
        });

        if (result.status === "blocked") {
          return {
            content: [
              {
                type: "text",
                text: `Execution blocked: ${result.blocked.reason}\nDetails: ${result.blocked.details}`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text",
              text: result.contract.contractText,
            },
          ],
        };
      },
    );

    // ========== RESOURCES ==========

    // Define a template for individual contexts
    const contextTemplate = new ResourceTemplate("context://{id}", {
      list: async (extra) => {
        const request = (extra as any).request as Request;
        const auth = request?.auth as any;
        const userId = auth?.userData?.userId;

        if (!userId) {
          throw new Error("Unauthorized: Authentication required");
        }

        const { resources } = await listMcpResources(userId);
        return { resources };
      },
    });

    server.registerResource(
      "context-resource",
      contextTemplate,
      {},
      async (uri, variables, extra) => {
        const request = (extra as any).request as Request;
        const auth = request?.auth as any;
        const userId = auth?.userData?.userId;

        if (!userId) {
          throw new Error("Unauthorized: Authentication required");
        }

        const { contents } = await readMcpResource(userId, uri.toString());
        return { contents };
      },
    );
  },
  {
    serverInfo: {
      name: "DevContext AI Server",
      version: "1.0.0",
    },
  },
  {
    basePath: "/api/mcp",
    verboseLogs: true,
  },
);

/**
 * Wrap the handler with MCP Auth to support Bearer token verification.
 */
const authenticatedHandler = withMcpAuth(
  mcpHandler,
  async (req) => {
    try {
      // Use our existing auth logic
      const auth = await requireApiKey(req);

      // Return AuthInfo compatible object
      // We also inject the original apiKey for the execute tool
      const apiKey =
        req.headers.get("x-api-key") ||
        req.headers.get("authorization")?.substring(7);

      return {
        userData: {
          userId: auth.userId,
          apiKey: apiKey,
        },
      } as any;
    } catch (e) {
      return undefined;
    }
  },
  { required: true },
);

export {
  authenticatedHandler as GET,
  authenticatedHandler as POST,
  authenticatedHandler as DELETE,
};
