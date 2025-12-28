import type {
  Context,
  ContextInput,
  ContextVersion,
  ContextVersionInput,
} from "../../../../src/features/core/domain/types/contexts"

describe("Context type", () => {
  it("should allow creating a valid Context object", () => {
    const context: Context = {
      id: "ctx-123",
      projectId: "proj-456",
      name: "Project Architecture",
      tags: ["architecture", "rules"],
      createdAt: "2024-12-28T00:00:00.000Z",
      updatedAt: "2024-12-28T01:00:00.000Z",
    }

    expect(context.id).toBe("ctx-123")
    expect(context.tags).toContain("architecture")
  })

  it("should allow creating a valid ContextInput object", () => {
    const input: ContextInput = {
      projectId: "proj-456",
      name: "New Context",
      tags: [],
    }

    expect(input.projectId).toBe("proj-456")
    // ContextInput should not have id, createdAt, or updatedAt
    expect((input as unknown as Context).id).toBeUndefined()
  })
})

describe("ContextVersion type", () => {
  it("should allow creating a valid ContextVersion object", () => {
    const version: ContextVersion = {
      id: "ver-789",
      contextId: "ctx-123",
      markdown: "# Context\n\nThis is the first version.",
      createdAt: "2024-12-28T00:00:00.000Z",
    }

    expect(version.contextId).toBe("ctx-123")
    expect(version.markdown).toContain("first version")
  })

  it("should allow creating a valid ContextVersionInput object", () => {
    const input: ContextVersionInput = {
      contextId: "ctx-123",
      markdown: "# Updated Context\n\nAnother version.",
    }

    expect(input.contextId).toBe("ctx-123")
    // ContextVersionInput should not have id or createdAt
    expect((input as unknown as ContextVersion).id).toBeUndefined()
  })
})
