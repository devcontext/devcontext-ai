import { NextResponse } from "next/server"
import { createContextDraft } from "@/features/core/app/composer/create-context-draft"
import type { Source } from "@/features/core/domain/types/sources"
import type { ComposerMode } from "@/features/composer/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { sources, mode } = body as {
      sources: Omit<Source, "id" | "projectId" | "createdAt">[]
      mode: ComposerMode
    }

    if (!sources || !Array.isArray(sources)) {
      return NextResponse.json(
        { error: "sources array is required" },
        { status: 400 }
      )
    }

    if (mode === "reference-only") {
      return NextResponse.json({ draft: "" })
    }

    // Convert to Source type (mock projectId and createdAt for draft generation)
    const sourcesWithMeta: Source[] = sources.map((s, i) => ({
      ...s,
      id: `temp-${i}`,
      projectId: "temp",
      createdAt: new Date().toISOString(),
    }))

    const draft = await createContextDraft({
      sources: sourcesWithMeta,
      mode,
    })

    return NextResponse.json({ draft })
  } catch (error) {
    console.error("Generate draft error:", error)
    return NextResponse.json(
      { error: "Failed to generate draft" },
      { status: 500 }
    )
  }
}
