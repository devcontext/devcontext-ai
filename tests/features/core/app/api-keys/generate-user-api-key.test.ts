import { generateUserApiKey } from "@/features/core/app/api-keys/generate-user-api-key";
import { ApiKeyRepository } from "@/features/core/infra/db/api-key-repository";

// Mock the repository
jest.mock("@/features/core/infra/db/api-key-repository");

describe("generateUserApiKey", () => {
  let mockSupabase: any;
  let mockCreateApiKey: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock Supabase client
    mockSupabase = {};

    // Mock the repository methods
    mockCreateApiKey = jest.fn();
    (ApiKeyRepository as jest.Mock).mockImplementation(() => ({
      createApiKey: mockCreateApiKey,
    }));
  });

  it("should generate and store an API key successfully", async () => {
    const mockUserId = "user-123";
    const mockName = "Test Key";
    const mockCreatedKey = {
      id: "key-456",
      userId: mockUserId,
      name: mockName,
      keyHash: "mock-hash",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUsedAt: null,
      revokedAt: null,
    };

    mockCreateApiKey.mockResolvedValue(mockCreatedKey);

    const result = await generateUserApiKey(mockSupabase, mockUserId, mockName);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.apiKey).toMatch(/^dctx_/);
      expect(result.apiKey.length).toBe(48);
      expect(result.keyId).toBe(mockCreatedKey.id);
      expect(result.name).toBe(mockName);
    }

    expect(mockCreateApiKey).toHaveBeenCalledWith({
      userId: mockUserId,
      name: mockName,
      keyHash: expect.any(String),
    });
  });

  it("should return error when userId is missing", async () => {
    const result = await generateUserApiKey(mockSupabase, "", "Test Key");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("User ID and name are required");
    }
    expect(mockCreateApiKey).not.toHaveBeenCalled();
  });

  it("should return error when name is empty", async () => {
    const result = await generateUserApiKey(mockSupabase, "user-123", "");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("User ID and name are required");
    }
    expect(mockCreateApiKey).not.toHaveBeenCalled();
  });

  it("should trim whitespace from name", async () => {
    const mockUserId = "user-123";
    const mockName = "  Test Key  ";
    const mockCreatedKey = {
      id: "key-456",
      userId: mockUserId,
      name: mockName.trim(),
      keyHash: "mock-hash",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUsedAt: null,
      revokedAt: null,
    };

    mockCreateApiKey.mockResolvedValue(mockCreatedKey);

    const result = await generateUserApiKey(mockSupabase, mockUserId, mockName);

    expect(result.success).toBe(true);
    expect(mockCreateApiKey).toHaveBeenCalledWith({
      userId: mockUserId,
      name: mockName.trim(),
      keyHash: expect.any(String),
    });
  });

  it("should handle repository errors gracefully", async () => {
    const mockUserId = "user-123";
    const mockName = "Test Key";

    mockCreateApiKey.mockRejectedValue(new Error("Database connection failed"));

    const result = await generateUserApiKey(mockSupabase, mockUserId, mockName);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Database connection failed");
    }
  });

  it("should generate different keys for each call", async () => {
    const mockUserId = "user-123";
    const mockName = "Test Key";
    const mockCreatedKey = {
      id: "key-456",
      userId: mockUserId,
      name: mockName,
      keyHash: "mock-hash",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUsedAt: null,
      revokedAt: null,
    };

    mockCreateApiKey.mockResolvedValue(mockCreatedKey);

    const result1 = await generateUserApiKey(
      mockSupabase,
      mockUserId,
      mockName,
    );
    const result2 = await generateUserApiKey(
      mockSupabase,
      mockUserId,
      mockName,
    );

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);

    if (result1.success && result2.success) {
      expect(result1.apiKey).not.toBe(result2.apiKey);
    }
  });
});
