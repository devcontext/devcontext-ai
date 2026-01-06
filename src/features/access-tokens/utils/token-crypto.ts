import crypto from "crypto";
import { ACCESS_TOKEN_PREFIX } from "../constants";

/**
 * Gets the HMAC secret from environment
 * @throws Error if secret is not configured
 */
function getHmacSecret(): string {
  const secret = process.env.ACCESS_TOKEN_HMAC_SECRET;
  if (!secret) {
    throw new Error(
      "ACCESS_TOKEN_HMAC_SECRET environment variable is not configured",
    );
  }
  return secret;
}

/**
 * Generates a secure random access token with the dca_at_ prefix
 * Uses CSPRNG for 32 bytes of entropy
 * @returns A secure random access token string
 * @example
 * const token = generateAccessTokenPlain();
 * // Returns: "dca_at_..." (~49 chars total)
 */
export function generateAccessTokenPlain(): string {
  // Generate 32 bytes of cryptographically secure random data
  const randomBytes = crypto.randomBytes(32);

  // Convert to base64url (URL-safe base64)
  const base64url = randomBytes
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  // Add prefix
  return `${ACCESS_TOKEN_PREFIX}${base64url}`;
}

/**
 * Hashes an access token using HMAC-SHA256 with a server secret
 * This is the ONLY hash function used for access tokens.
 *
 * @param tokenPlain - The plain text access token to hash
 * @returns The HMAC-SHA256 hash as a hex string
 * @throws Error if HMAC secret is not configured
 *
 * @example
 * const hash = hashAccessTokenHmac("dca_at_abc123...");
 * // Returns: 64-char hex string
 */
export function hashAccessTokenHmac(tokenPlain: string): string {
  const secret = getHmacSecret();
  return crypto.createHmac("sha256", secret).update(tokenPlain).digest("hex");
}
