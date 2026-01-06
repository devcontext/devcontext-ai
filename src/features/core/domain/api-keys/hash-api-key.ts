import crypto from "crypto";

/**
 * Hashes an API key using SHA-256
 * @param apiKey - The plain text API key to hash
 * @returns The SHA-256 hash as a hex string
 * @example
 * const hash = hashApiKey("dctx_abc123");
 * // Returns: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
 */
export function hashApiKey(apiKey: string): string {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}
