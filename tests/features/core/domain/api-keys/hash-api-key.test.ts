import { hashApiKey } from "@/features/core/domain/api-keys/hash-api-key";

describe("hashApiKey", () => {
  it("should hash a key to a hex string", () => {
    const key = "dctx_test123456789";
    const hash = hashApiKey(key);

    // SHA-256 produces 64 hex characters
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("should be deterministic (same input = same output)", () => {
    const key = "dctx_test123456789";
    const hash1 = hashApiKey(key);
    const hash2 = hashApiKey(key);
    const hash3 = hashApiKey(key);

    expect(hash1).toBe(hash2);
    expect(hash2).toBe(hash3);
  });

  it("should produce different hashes for different inputs", () => {
    const key1 = "dctx_test123456789";
    const key2 = "dctx_test987654321";
    const key3 = "dctx_different_key";

    const hash1 = hashApiKey(key1);
    const hash2 = hashApiKey(key2);
    const hash3 = hashApiKey(key3);

    expect(hash1).not.toBe(hash2);
    expect(hash2).not.toBe(hash3);
    expect(hash1).not.toBe(hash3);
  });

  it("should produce different hashes for similar inputs", () => {
    const key1 = "dctx_test123456789";
    const key2 = "dctx_test123456788"; // Only last char different

    const hash1 = hashApiKey(key1);
    const hash2 = hashApiKey(key2);

    expect(hash1).not.toBe(hash2);
  });

  it("should handle empty string", () => {
    const hash = hashApiKey("");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("should handle very long strings", () => {
    const longKey = "dctx_" + "a".repeat(1000);
    const hash = hashApiKey(longKey);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("should produce consistent hash for known input", () => {
    // Test with a known SHA-256 hash for verification
    const key = "test";
    const hash = hashApiKey(key);

    // SHA-256 of "test" is known
    const expectedHash =
      "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";
    expect(hash).toBe(expectedHash);
  });
});
