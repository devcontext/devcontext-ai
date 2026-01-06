import { generateAccessToken } from "@/features/access-tokens/services/generate-token";
import crypto from "crypto";

describe("generateAccessToken", () => {
  const getEntropy = () => crypto.randomBytes(32);

  it("should generate a token with the correct prefix", () => {
    const token = generateAccessToken(getEntropy());
    expect(token).toMatch(/^dctx_/);
  });

  it("should generate a token with correct length", () => {
    const token = generateAccessToken(getEntropy());
    // dctx_ (5 chars) + 43 base64url chars (32 bytes) = 48 total
    expect(token.length).toBe(48);
  });

  it("should generate unique tokens", () => {
    const token1 = generateAccessToken(getEntropy());
    const token2 = generateAccessToken(getEntropy());
    const token3 = generateAccessToken(getEntropy());

    expect(token1).not.toBe(token2);
    expect(token2).not.toBe(token3);
    expect(token1).not.toBe(token3);
  });

  it("should only contain valid characters (prefix + base64url)", () => {
    const token = generateAccessToken(getEntropy());
    // Should be dctx_ followed by base64url characters (A-Z, a-z, 0-9, -, _)
    expect(token).toMatch(/^dctx_[A-Za-z0-9_-]{43}$/);
  });

  it("should generate cryptographically secure random tokens", () => {
    // Generate multiple tokens and ensure they're all different
    const tokens = new Set();
    for (let i = 0; i < 100; i++) {
      tokens.add(generateAccessToken(getEntropy()));
    }
    // All 100 tokens should be unique
    expect(tokens.size).toBe(100);
  });
});
