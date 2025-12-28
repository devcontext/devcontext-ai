import type { Source } from "../../domain/types/sources"

export type ComposerMode = "reference-only" | "guided-draft" | "both"

export type CreateContextDraftInput = {
  sources: Source[]
  mode: ComposerMode
}

/**
 * Generates a structured context draft from sources using AI.
 * 
 * NOTE: This is a placeholder implementation for MVP.
 * The actual LLM integration will be added when AI provider is configured.
 */
export async function createContextDraft(
  input: CreateContextDraftInput
): Promise<string> {
  // For "reference-only" mode, no draft is generated
  if (input.mode === "reference-only") {
    return ""
  }

  // Concatenate source contents for context
  const sourceContents = input.sources
    .map((s) => `## ${s.name}\n\n${s.content}`)
    .join("\n\n---\n\n")

  // TODO: Replace with actual LLM call when AI provider is configured
  // For now, return a structured template based on sources
  const draft = `# Context Draft

## Overview
This context was generated from ${input.sources.length} source(s).

## Source Summary
${sourceContents}

## Architecture Notes
*(Add architecture decisions and patterns here)*

## Rules & Constraints
*(Add coding rules and constraints here)*

## Additional Context
*(Add any other relevant context)*
`

  return draft
}
