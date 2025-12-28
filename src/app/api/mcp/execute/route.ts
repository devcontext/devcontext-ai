import { NextResponse } from "next/server";
import { mcpExecute } from "@/features/core/app/mcp-execute";

/**
 * MCP Execute API Adapter
 *
 * Exposes the system as an endpoint compatible with MCP clients or general remote execution.
 * This route triggers the persistence of execution logs.
 */
export async function POST(request: Request) {
  try {
    // 1. Auth check
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Missing API Key" },
        { status: 401 },
      );
    }

    // 2. Body Validation
    const body = await request.json();

    const projectId =
      typeof body.projectId === "string" ? body.projectId.trim() : "";
    const commandId =
      typeof body.commandId === "string" ? body.commandId.trim() : "";
    const userInput =
      typeof body.userInput === "string" ? body.userInput.trim() : "";

    if (!projectId || !commandId || !userInput) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message:
            "Missing or invalid required fields (projectId, commandId, userInput)",
        },
        { status: 400 },
      );
    }

    // 3. Call App Layer (mcpExecute includes logging)
    // We pass apiKey as requested. Using a cast if the app layer type hasn't been updated yet.
    const result = await mcpExecute({
      projectId,
      commandId,
      userInput,
      apiKey,
      target: body.target,
      contextHints: body.contextHints,
    } as any);

    // 4. Return Result
    if (result.status === "blocked") {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error [mcp/execute]:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred during MCP execution.",
      },
      { status: 500 },
    );
  }
}
