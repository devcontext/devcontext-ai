import { Source, SourceInput } from "@/features/core/domain/types"

describe("Source type", () => {
  it("should allow creating a valid Source object", () => {
    const source: Source = {
      id: "src-123",
      projectId: "proj-456",
      name: "architecture.md",
      type: "file",
      content: "# Architecture\n\nThis is the architecture doc.",
      createdAt: "2024-12-28T00:00:00.000Z",
    }

    expect(source.id).toBe("src-123")
    expect(source.type).toBe("file")
  })

  it("should allow creating a valid SourceInput object", () => {
    const input: SourceInput = {
      projectId: "proj-456",
      name: "pasted-notes",
      type: "text",
      content: "Some pasted text content",
    }

    expect(input.projectId).toBe("proj-456")
    expect(input.type).toBe("text")
    // SourceInput should not have id or createdAt
    expect((input as unknown as Source).id).toBeUndefined()
  })
})
