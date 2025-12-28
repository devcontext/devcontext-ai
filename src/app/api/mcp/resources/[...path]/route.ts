import { NextResponse } from "next/server";
import { requireApiKey } from "@/features/shared/lib/mcp-auth";
import { readMcpResource } from "@/features/core/app/mcp/read-mcp-resource";

/**
 * MCP resources/read API Route
 *
 * Returns the markdown content of the latest version of a context.
 * Identifies the context via URI passed in the path or query params.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    // 1. Validate Auth
    const { userId } = await requireApiKey(request);

    // 2. Resolve URI
    const { path } = await params;
    const searchParams = new URL(request.url).searchParams;

    // Support URI as a query parameter (standard MCP) or as a path segment
    let resourceUri = searchParams.get("uri");

    if (!resourceUri && path && path.length > 0) {
      // Reconstruct URI from path (e.g., if path is ["context", "id"] -> context://id)
      if (path[0] === "context" && path[1]) {
        resourceUri = `context://${path[1]}`;
      } else {
        // Fallback for direct path usage
        resourceUri = `context://${path.join("/")}`;
      }
    }

    if (!resourceUri) {
      return NextResponse.json(
        { error: "Bad Request", message: "Missing resource URI" },
        { status: 400 },
      );
    }

    // 3. Fetch Resource Content
    const { contents } = await readMcpResource(userId, resourceUri);

    // 4. Return MCP-compatible response
    return NextResponse.json({
      contents,
    });
  } catch (error: any) {
    const isAuthError =
      error.message === "Missing API Key" ||
      error.message === "Invalid API Key" ||
      error.message === "Unauthorized access to resource";
    const status = isAuthError ? 401 : 500;
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status },
    );
  }
}

/**
 * Support POST for clients that prefer it
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return GET(request, { params });
}
