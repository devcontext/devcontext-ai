import crypto from "crypto";

/**
 * Hashes an access token using SHA-256
 * @param token - The plain text access token to hash
 * @returns The SHA-256 hash as a hex string
 * @example
 * const hash = hashAccessToken("dctx_abc123");
 * // Returns: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
 */
export function hashAccessToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
