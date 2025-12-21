import { NextResponse } from "next/server";
import { resolvePreview } from "@/features/core/app/resolve-preview";
import { ResolveRequest } from "@/features/core/domain/types/resolver";

export async function POST(request: Request) {
  try {
    // 1. Basic Auth (MVP: Header check)
    // In a real scenario, we would hash this and check against the Account table.
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

    // 3. Call App Layer
    const result = await resolvePreview({
      projectId,
      commandId,
      userInput,
      target: body.target,
      contextHints: body.contextHints,
    });

    // 4. Return Result
    if (result.status === "blocked") {
      return NextResponse.json(result, { status: 422 }); // Unprocessable Entity for logic blocks
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error [resolve]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
