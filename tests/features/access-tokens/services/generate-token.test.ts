import { generateAccessTokenPlain } from "@/features/access-tokens/utils/token-crypto";
import { ACCESS_TOKEN_PREFIX } from "@/features/access-tokens/constants";

describe("generateAccessTokenPlain", () => {
  it("should generate a token with the correct prefix", () => {
    const token = generateAccessTokenPlain();
    expect(token).toMatch(new RegExp(`^${ACCESS_TOKEN_PREFIX}`));
    expect(token.startsWith("dca_at_")).toBe(true);
  });

  it("should generate a token with correct length", () => {
    const token = generateAccessTokenPlain();
    // dca_at_ (7 chars) + 43 base64url chars (32 bytes) = 50 total
    expect(token.length).toBe(50);
  });

  it("should generate unique tokens", () => {
    const token1 = generateAccessTokenPlain();
    const token2 = generateAccessTokenPlain();
    const token3 = generateAccessTokenPlain();

    expect(token1).not.toBe(token2);
    expect(token2).not.toBe(token3);
    expect(token1).not.toBe(token3);
  });

  it("should only contain valid characters (prefix + base64url)", () => {
    const token = generateAccessTokenPlain();
    // Should be dca_at_ followed by base64url characters (A-Z, a-z, 0-9, -, _)
    expect(token).toMatch(/^dca_at_[A-Za-z0-9_-]{43}$/);
  });

  it("should generate cryptographically secure random tokens", () => {
    // Generate multiple tokens and ensure they're all different
    const tokens = new Set();
    for (let i = 0; i < 100; i++) {
      tokens.add(generateAccessTokenPlain());
    }
    // All 100 tokens should be unique
    expect(tokens.size).toBe(100);
  });
});
