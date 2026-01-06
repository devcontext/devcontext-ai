import { type SupabaseClient } from "@supabase/supabase-js";
import { resolvePreview } from "./resolve-preview";
import { ResolveLogsRepository } from "../infra/db/resolve-logs-repository";
import { ResolveRequest, ResolveResult } from "../domain/types/resolver";

/**
 * mcpExecute
 *
 * Executes the resolution process and persists the execution logs.
 * This is the primary entry point for the MCP adapter.
 */
export async function mcpExecute(
  request: ResolveRequest,
  supabase: SupabaseClient,
): Promise<ResolveResult> {
  const resolveLogsRepository = new ResolveLogsRepository(supabase);

  // 1. Orchestrate resolution
  const result = await resolvePreview(request, supabase);

  // 2. Persist Logs (Infra)
  await resolveLogsRepository.log({
    project_id: request.projectId,
    command_id: request.commandId,
    intent_id: result.status === "ok" ? result.contract.intentId : "unknown",
    status: result.status,
    blocked_reason:
      result.status === "blocked" ? result.blocked.reason : undefined,
    contract_text:
      result.status === "ok" ? result.contract.contractText : undefined,
    metadata:
      result.status === "ok"
        ? (result.contract.meta as any)
        : {
            error_details:
              result.status === "blocked" ? result.blocked.details : undefined,
          },
  });

  return result;
}
