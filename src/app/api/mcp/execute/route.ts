import { NextResponse } from "next/server";
import { mcpExecute } from "@/features/core/app/mcp-execute";
import { ResolveRequest } from "@/features/core/domain/types/resolver";

/**
 * MCP Execute API Adapter
 * 
 * Exposes the system as an endpoint compatible with MCP clients or general remote execution.
 * This route triggers the persistence of execution logs.
 */
export async function POST(request: Request) {
  try {
    // 1. Basic Auth (MVP: Header check)
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Missing API Key" },
        { status: 401 }
      );
    }

    // 2. Body Validation
    const body = await request.json();
    const { projectId, commandId, userInput } = body as ResolveRequest;

    if (!projectId || !commandId || !userInput) {
      return NextResponse.json(
        { error: "Bad Request", message: "Missing required fields (projectId, commandId, userInput)" },
        { status: 400 }
      );
    }

    // 3. Call App Layer (mcpExecute includes logging)
    const result = await mcpExecute({
      projectId,
      commandId,
      userInput,
      target: body.target,
      contextHints: body.contextHints,
    });

    // 4. Return Result
    if (result.status === "blocked") {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error [mcp/execute]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "An unexpected error occurred during MCP execution." },
      { status: 500 }
    );
  }
}
