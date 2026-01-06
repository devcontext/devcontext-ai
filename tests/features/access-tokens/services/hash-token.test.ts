import { hashAccessToken } from "@/features/access-tokens/services/hash-token";

describe("hashAccessToken", () => {
  it("should hash a token to a hex string", () => {
    const token = "dctx_test123456789";
    const hash = hashAccessToken(token);

    // SHA-256 produces 64 hex characters
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("should be deterministic (same input = same output)", () => {
    const token = "dctx_test123456789";
    const hash1 = hashAccessToken(token);
    const hash2 = hashAccessToken(token);
    const hash3 = hashAccessToken(token);

    expect(hash1).toBe(hash2);
    expect(hash2).toBe(hash3);
  });

  it("should produce different hashes for different inputs", () => {
    const token1 = "dctx_test123456789";
    const token2 = "dctx_test987654321";
    const token3 = "dctx_different_token";

    const hash1 = hashAccessToken(token1);
    const hash2 = hashAccessToken(token2);
    const hash3 = hashAccessToken(token3);

    expect(hash1).not.toBe(hash2);
    expect(hash2).not.toBe(hash3);
    expect(hash1).not.toBe(hash3);
  });

  it("should produce different hashes for similar inputs", () => {
    const token1 = "dctx_test123456789";
    const token2 = "dctx_test123456788"; // Only last char different

    const hash1 = hashAccessToken(token1);
    const hash2 = hashAccessToken(token2);

    expect(hash1).not.toBe(hash2);
  });

  it("should handle empty string", () => {
    const hash = hashAccessToken("");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("should handle very long strings", () => {
    const longToken = "dctx_" + "a".repeat(1000);
    const hash = hashAccessToken(longToken);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("should produce consistent hash for known input", () => {
    // Test with a known SHA-256 hash for verification
    const token = "test";
    const hash = hashAccessToken(token);

    // SHA-256 of "test" is known
    const expectedHash =
      "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";
    expect(hash).toBe(expectedHash);
  });
});
