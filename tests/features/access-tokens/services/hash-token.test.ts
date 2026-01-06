import { hashAccessTokenHmac } from "@/features/access-tokens/utils/token-crypto";

// Mock the environment variable for testing
const TEST_HMAC_SECRET = "test-secret-for-testing-only";

beforeAll(() => {
  process.env.ACCESS_TOKEN_HMAC_SECRET = TEST_HMAC_SECRET;
});

afterAll(() => {
  delete process.env.ACCESS_TOKEN_HMAC_SECRET;
});

describe("hashAccessTokenHmac", () => {
  it("should hash a token to a hex string", () => {
    const token = "dca_at_test123456789";
    const hash = hashAccessTokenHmac(token);

    // HMAC-SHA256 produces 64 hex characters
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("should be deterministic (same input = same output)", () => {
    const token = "dca_at_test123456789";
    const hash1 = hashAccessTokenHmac(token);
    const hash2 = hashAccessTokenHmac(token);
    const hash3 = hashAccessTokenHmac(token);

    expect(hash1).toBe(hash2);
    expect(hash2).toBe(hash3);
  });

  it("should produce different hashes for different inputs", () => {
    const token1 = "dca_at_test123456789";
    const token2 = "dca_at_test987654321";
    const token3 = "dca_at_different_token";

    const hash1 = hashAccessTokenHmac(token1);
    const hash2 = hashAccessTokenHmac(token2);
    const hash3 = hashAccessTokenHmac(token3);

    expect(hash1).not.toBe(hash2);
    expect(hash2).not.toBe(hash3);
    expect(hash1).not.toBe(hash3);
  });

  it("should produce different hashes for similar inputs", () => {
    const token1 = "dca_at_test123456789";
    const token2 = "dca_at_test123456788"; // Only last char different

    const hash1 = hashAccessTokenHmac(token1);
    const hash2 = hashAccessTokenHmac(token2);

    expect(hash1).not.toBe(hash2);
  });

  it("should handle empty string", () => {
    const hash = hashAccessTokenHmac("");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("should handle very long strings", () => {
    const longToken = "dca_at_" + "a".repeat(1000);
    const hash = hashAccessTokenHmac(longToken);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("should throw error if HMAC secret is not configured", () => {
    const originalSecret = process.env.ACCESS_TOKEN_HMAC_SECRET;
    delete process.env.ACCESS_TOKEN_HMAC_SECRET;

    expect(() => hashAccessTokenHmac("test")).toThrow(
      "ACCESS_TOKEN_HMAC_SECRET environment variable is not configured",
    );

    // Restore
    process.env.ACCESS_TOKEN_HMAC_SECRET = originalSecret;
  });
});
