import crypto from "crypto";

/**
 * Generates a secure random API key with the dctx_ prefix
 * @returns A secure random API key string
 * @example
 * const key = generateApiKey();
 * // Returns: "dctx_a1b2c3d4e5f6..."
 */
export function generateApiKey(): string {
  // Generate 32 random bytes
  const randomBytes = crypto.randomBytes(32);

  // Convert to base64url (URL-safe base64)
  const base64url = randomBytes
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  // Add prefix
  return `dctx_${base64url}`;
}
