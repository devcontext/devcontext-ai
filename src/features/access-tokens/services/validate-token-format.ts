/**
 * Validates the format of an access token
 * @param token - The access token to validate
 * @returns True if the token has valid format, false otherwise
 * @example
 * validateAccessTokenFormat("dctx_abc123"); // true
 * validateAccessTokenFormat("invalid"); // false
 */
export function validateAccessTokenFormat(token: string): boolean {
  // Must start with dctx_
  if (!token.startsWith("dctx_")) {
    return false;
  }

  // Must have content after prefix
  const tokenPart = token.slice(5); // Remove "dctx_"
  if (tokenPart.length === 0) {
    return false;
  }

  // Should be base64url characters only (a-z, A-Z, 0-9, -, _)
  const base64urlPattern = /^[A-Za-z0-9\-_]+$/;
  return base64urlPattern.test(tokenPart);
}
