/**
 * Validates the format of an API key
 * @param apiKey - The API key to validate
 * @returns True if the key has valid format, false otherwise
 * @example
 * validateApiKeyFormat("dctx_abc123"); // true
 * validateApiKeyFormat("invalid"); // false
 */
export function validateApiKeyFormat(apiKey: string): boolean {
  // Must start with dctx_
  if (!apiKey.startsWith("dctx_")) {
    return false;
  }

  // Must have content after prefix
  const keyPart = apiKey.slice(5); // Remove "dctx_"
  if (keyPart.length === 0) {
    return false;
  }

  // Should be base64url characters only (a-z, A-Z, 0-9, -, _)
  const base64urlPattern = /^[A-Za-z0-9\-_]+$/;
  return base64urlPattern.test(keyPart);
}
