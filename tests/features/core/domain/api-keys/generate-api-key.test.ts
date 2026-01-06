import { generateApiKey } from "@/features/core/domain/api-keys/generate-api-key";
import crypto from "crypto";

describe("generateApiKey", () => {
  const getEntropy = () => crypto.randomBytes(32);

  it("should generate a key with the correct prefix", () => {
    const key = generateApiKey(getEntropy());
    expect(key).toMatch(/^dctx_/);
  });

  it("should generate a key with correct length", () => {
    const key = generateApiKey(getEntropy());
    // dctx_ (5 chars) + 43 base64url chars (32 bytes) = 48 total
    expect(key.length).toBe(48);
  });

  it("should generate unique keys", () => {
    const key1 = generateApiKey(getEntropy());
    const key2 = generateApiKey(getEntropy());
    const key3 = generateApiKey(getEntropy());

    expect(key1).not.toBe(key2);
    expect(key2).not.toBe(key3);
    expect(key1).not.toBe(key3);
  });

  it("should only contain valid characters (prefix + base64url)", () => {
    const key = generateApiKey(getEntropy());
    // Should be dctx_ followed by base64url characters (A-Z, a-z, 0-9, -, _)
    expect(key).toMatch(/^dctx_[A-Za-z0-9_-]{43}$/);
  });

  it("should generate cryptographically secure random keys", () => {
    // Generate multiple keys and ensure they're all different
    const keys = new Set();
    for (let i = 0; i < 100; i++) {
      keys.add(generateApiKey(getEntropy()));
    }
    // All 100 keys should be unique
    expect(keys.size).toBe(100);
  });
});
