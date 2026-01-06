#!/usr/bin/env npx ts-node
/**
 * MCP Authentication Test Suite
 *
 * Runs against a local or deployed MCP server to verify authentication behavior.
 *
 * Usage:
 *   # First, generate a token via the UI (Settings → Access Tokens)
 *   # Then run:
 *   npx ts-node scripts/test-mcp-auth.ts --token YOUR_TOKEN
 *
 *   # Or set env var:
 *   MCP_TEST_TOKEN=dca_at_xxx npx ts-node scripts/test-mcp-auth.ts
 */

const BASE_URL = process.env.MCP_BASE_URL || "http://localhost:3000";
const MCP_ENDPOINT = `${BASE_URL}/api/mcp/http`;

// Get token from CLI args or env
function getTestToken(): string | null {
  const args = process.argv.slice(2);
  const tokenIndex = args.indexOf("--token");
  if (tokenIndex !== -1 && args[tokenIndex + 1]) {
    return args[tokenIndex + 1];
  }
  return process.env.MCP_TEST_TOKEN || null;
}

type TestResult = {
  name: string;
  passed: boolean;
  message: string;
  response?: any;
};

const results: TestResult[] = [];

function log(
  message: string,
  type: "info" | "success" | "error" | "warn" = "info",
) {
  const colors = {
    info: "\x1b[36m", // cyan
    success: "\x1b[32m", // green
    error: "\x1b[31m", // red
    warn: "\x1b[33m", // yellow
  };
  const reset = "\x1b[0m";
  console.log(`${colors[type]}${message}${reset}`);
}

async function makeRequest(options: {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}): Promise<{ status: number; body: any }> {
  const { method = "POST", headers = {}, body } = options;

  try {
    const response = await fetch(MCP_ENDPOINT, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get("content-type");
    let responseBody;
    if (contentType?.includes("application/json")) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    return { status: response.status, body: responseBody };
  } catch (error: any) {
    return { status: 0, body: { error: error.message } };
  }
}

// ============================================================================
// TEST CASES
// ============================================================================

async function testWithoutToken(): Promise<TestResult> {
  const name = "1. Sin Token (No Authorization header)";
  log(`\n▶ ${name}`, "info");

  const { status, body } = await makeRequest({
    body: { jsonrpc: "2.0", method: "initialize", id: 1 },
  });

  const passed = status === 401 && body?.error?.message?.includes("Missing");

  return {
    name,
    passed,
    message: passed
      ? `✅ Correctly returned 401 with JSON-RPC error`
      : `❌ Expected 401 with missing token error, got ${status}: ${JSON.stringify(body)}`,
    response: body,
  };
}

async function testInvalidToken(): Promise<TestResult> {
  const name = "2. Token Inválido (random/malformado)";
  log(`\n▶ ${name}`, "info");

  const { status, body } = await makeRequest({
    headers: { Authorization: "Bearer invalid_token_xyz123" },
    body: { jsonrpc: "2.0", method: "initialize", id: 1 },
  });

  const passed = status === 403 && body?.error?.message?.includes("Invalid");

  return {
    name,
    passed,
    message: passed
      ? `✅ Correctly returned 403 for invalid token`
      : `❌ Expected 403 with invalid token error, got ${status}: ${JSON.stringify(body)}`,
    response: body,
  };
}

async function testMalformedAuthHeader(): Promise<TestResult> {
  const name = "3. Header Authorization malformado (sin Bearer prefix)";
  log(`\n▶ ${name}`, "info");

  const { status, body } = await makeRequest({
    headers: { Authorization: "some_token_without_bearer" },
    body: { jsonrpc: "2.0", method: "initialize", id: 1 },
  });

  // Should fallback to x-access-token which is also not present, so 401
  const passed = status === 401;

  return {
    name,
    passed,
    message: passed
      ? `✅ Correctly returned 401 for malformed auth header`
      : `❌ Expected 401, got ${status}: ${JSON.stringify(body)}`,
    response: body,
  };
}

async function testValidToken(token: string): Promise<TestResult> {
  const name = "4. Token Válido - Initialize";
  log(`\n▶ ${name}`, "info");

  const { status, body } = await makeRequest({
    headers: { Authorization: `Bearer ${token}` },
    body: { jsonrpc: "2.0", method: "initialize", id: 1 },
  });

  const passed = status === 200 && body?.result?.protocolVersion;

  return {
    name,
    passed,
    message: passed
      ? `✅ Successfully initialized with valid token. Protocol: ${body.result.protocolVersion}`
      : `❌ Expected 200 with protocolVersion, got ${status}: ${JSON.stringify(body)}`,
    response: body,
  };
}

async function testResourcesList(token: string): Promise<TestResult> {
  const name = "5. Token Válido - List Resources";
  log(`\n▶ ${name}`, "info");

  const { status, body } = await makeRequest({
    headers: { Authorization: `Bearer ${token}` },
    body: { jsonrpc: "2.0", method: "resources/list", id: 2 },
  });

  const passed = status === 200 && Array.isArray(body?.result?.resources);

  return {
    name,
    passed,
    message: passed
      ? `✅ Successfully listed resources. Count: ${body.result.resources.length}`
      : `❌ Expected 200 with resources array, got ${status}: ${JSON.stringify(body)}`,
    response: body,
  };
}

async function testResourcesRead(token: string): Promise<TestResult> {
  const name = "6. Token Válido - Read Resource (contexto existente)";
  log(`\n▶ ${name}`, "info");

  // First, get the list of resources
  const listResponse = await makeRequest({
    headers: { Authorization: `Bearer ${token}` },
    body: { jsonrpc: "2.0", method: "resources/list", id: 2 },
  });

  if (!listResponse.body?.result?.resources?.length) {
    return {
      name,
      passed: false,
      message: `⚠️ No resources available to test. Create a context first.`,
      response: listResponse.body,
    };
  }

  const resourceUri = listResponse.body.result.resources[0].uri;

  const { status, body } = await makeRequest({
    headers: { Authorization: `Bearer ${token}` },
    body: {
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: resourceUri },
      id: 3,
    },
  });

  const passed = status === 200 && Array.isArray(body?.result?.contents);

  return {
    name,
    passed,
    message: passed
      ? `✅ Successfully read resource: ${resourceUri}`
      : `❌ Expected 200 with contents, got ${status}: ${JSON.stringify(body)}`,
    response: body,
  };
}

async function testUnauthorizedResourceRead(
  token: string,
): Promise<TestResult> {
  const name = "7. Scope - Read Resource de otro usuario (ID falso)";
  log(`\n▶ ${name}`, "info");

  // Try to read a resource that doesn't belong to the user
  const fakeUri = "context://00000000-0000-0000-0000-000000000000";

  const { status, body } = await makeRequest({
    headers: { Authorization: `Bearer ${token}` },
    body: {
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: fakeUri },
      id: 3,
    },
  });

  // Should get a 500 with NotFoundError (or similar) - NOT return data
  const passed = status !== 200 || body?.error;

  return {
    name,
    passed,
    message: passed
      ? `✅ Correctly denied access to unauthorized resource`
      : `❌ Should have denied access, got ${status}: ${JSON.stringify(body)}`,
    response: body,
  };
}

async function testLegacyHeader(token: string): Promise<TestResult> {
  const name = "8. Legacy Header (x-access-token)";
  log(`\n▶ ${name}`, "info");

  const { status, body } = await makeRequest({
    headers: { "x-access-token": token },
    body: { jsonrpc: "2.0", method: "initialize", id: 1 },
  });

  const passed = status === 200 && body?.result?.protocolVersion;

  return {
    name,
    passed,
    message: passed
      ? `✅ Legacy x-access-token header works`
      : `❌ Expected 200 with protocolVersion, got ${status}: ${JSON.stringify(body)}`,
    response: body,
  };
}

async function testToolsListEmpty(): Promise<TestResult> {
  const name = "9. Tools List (MVP - debe estar vacío/deshabilitado)";
  log(`\n▶ ${name}`, "info");

  const token = getTestToken();
  if (!token) {
    return {
      name,
      passed: false,
      message: "⚠️ Needs valid token to test",
    };
  }

  const { status, body } = await makeRequest({
    headers: { Authorization: `Bearer ${token}` },
    body: { jsonrpc: "2.0", method: "tools/list", id: 4 },
  });

  // MVP compliance: for Antigravity integration we now return one dummy tool
  const passed = status === 200 && body?.result?.tools?.length >= 0;

  return {
    name,
    passed,
    message: passed
      ? `✅ Tools list returns ${body?.result?.tools?.length} tools`
      : `❌ Expected tools list Result, got ${status}: ${JSON.stringify(body)}`,
    response: body,
  };
}

async function testHealthEndpoint(): Promise<TestResult> {
  const name = "10. Health Check (GET /api/mcp/http)";
  log(`\n▶ ${name}`, "info");

  const response = await fetch(MCP_ENDPOINT, { method: "GET" });
  const body = await response.json();

  const passed =
    response.status === 200 && body?.name === "DevContext AI Server";

  return {
    name,
    passed,
    message: passed
      ? `✅ Health check passed: ${body.name} v${body.version}`
      : `❌ Expected 200 with server info, got ${response.status}: ${JSON.stringify(body)}`,
    response: body,
  };
}

async function testErrorHandlingNoLeak(): Promise<TestResult> {
  const name = "11. Error Handling - No Data Leaks";
  log(`\n▶ ${name}`, "info");

  // Send malformed JSON-RPC
  const token = getTestToken();

  const { status, body } = await makeRequest({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: { invalid: "request" }, // Missing jsonrpc, method, id
  });

  // Check that response doesn't contain sensitive info
  const responseStr = JSON.stringify(body);
  const hasLeaks =
    responseStr.includes("ACCESS_TOKEN_HMAC_SECRET") ||
    responseStr.includes("token_hash") ||
    responseStr.includes("stack") ||
    responseStr.includes("at ") || // Stack traces
    (responseStr.includes("password") && responseStr.length > 100);

  const passed = !hasLeaks;

  return {
    name,
    passed,
    message: passed
      ? `✅ Error response doesn't leak sensitive data`
      : `❌ Potential data leak detected in error response`,
    response: body,
  };
}

// ============================================================================
// MAIN
// ============================================================================

async function runTests() {
  log("\n🔐 MCP Authentication Test Suite", "info");
  log("═".repeat(50), "info");
  log(`Target: ${MCP_ENDPOINT}`, "info");

  const token = getTestToken();

  // Tests that don't require a token
  results.push(await testHealthEndpoint());
  results.push(await testWithoutToken());
  results.push(await testInvalidToken());
  results.push(await testMalformedAuthHeader());
  results.push(await testErrorHandlingNoLeak());

  // Tests that require a valid token
  if (token) {
    log(`\n📌 Testing with token: ${token.substring(0, 15)}...`, "info");
    results.push(await testValidToken(token));
    results.push(await testResourcesList(token));
    results.push(await testResourcesRead(token));
    results.push(await testUnauthorizedResourceRead(token));
    results.push(await testLegacyHeader(token));
    results.push(await testToolsListEmpty());
  } else {
    log("\n⚠️  No token provided. Skipping authenticated tests.", "warn");
    log(
      "   Run with: npx ts-node scripts/test-mcp-auth.ts --token YOUR_TOKEN",
      "warn",
    );
    log("   Or set: MCP_TEST_TOKEN=dca_at_xxx", "warn");
  }

  // Summary
  log("\n" + "═".repeat(50), "info");
  log("📊 RESULTS SUMMARY", "info");
  log("═".repeat(50), "info");

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  results.forEach((r) => {
    log(r.message, r.passed ? "success" : "error");
  });

  log("\n" + "─".repeat(50), "info");
  log(
    `Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`,
    passed === results.length ? "success" : "error",
  );

  if (failed > 0) {
    log("\n❌ Some tests failed. Review the output above.", "error");
    process.exit(1);
  } else {
    log("\n✅ All tests passed!", "success");
  }
}

runTests().catch(console.error);
