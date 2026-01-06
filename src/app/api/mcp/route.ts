import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    message: "DevContext AI MCP Server is running.",
    endpoints: {
      http: "/api/mcp/http",
      config: "/.well-known/mcp-configuration",
    },
  });
}
