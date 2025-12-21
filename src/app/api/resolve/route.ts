import { NextResponse } from "next/server";
import { resolvePreview } from "@/features/core/app/resolve-preview";

type ResolveRequestDTO = {
  projectId: string;
  commandId: string;
  userInput: string;
  apiKey: string;
  target?: {
    pathHint?: string;
    files?: string[];
  };
  contextHints?: {
    currentBranch?: string;
    tool?: "cursor" | "chatgpt" | "gemini" | "unknown";
  };
};

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Missing API Key" },
        { status: 401 }
      );
    }

    // 2. Validation
    const body = await request.json();
    
    const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";
    const commandId = typeof body.commandId === "string" ? body.commandId.trim() : "";
    const userInput = typeof body.userInput === "string" ? body.userInput.trim() : "";

    if (!projectId || !commandId || !userInput) {
      return NextResponse.json(
        { error: "Bad Request", message: "Missing or invalid required fields (projectId, commandId, userInput)" },
        { status: 400 }
      );
    }

    // 3. Call App Layer
    // We pass apiKey as requested. Since we are restricted to this file, 
    // we use a cast if the app layer type hasn't been updated yet.
    const result = await resolvePreview({
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
    console.error("API Error [resolve]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
