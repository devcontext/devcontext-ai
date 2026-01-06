import crypto from "crypto";

/**
 * Generates a secure random access token with the dctx_ prefix
 * @param randomBytes - 32 bytes of entropy (Side effect must be handled by caller)
 * @returns A secure random access token string
 * @example
 * const entropy = crypto.randomBytes(32);
 * const token = generateAccessToken(entropy);
 * // Returns: "dctx_..."
 */
export function generateAccessToken(randomBytes: Buffer): string {
  // Convert to base64url (URL-safe base64)
  const base64url = randomBytes
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  // Add prefix
  return `dctx_${base64url}`;
}
