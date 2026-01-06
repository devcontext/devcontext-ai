import { type SupabaseClient } from "@supabase/supabase-js";
import { resolvePreview } from "../../core/app/resolve-preview";
import { ResolveLogsRepository } from "../../core/infra/db/resolve-logs-repository";
import {
  ResolveRequest,
  ResolveResult,
} from "../../core/domain/types/resolver";

/**
 * McpExecutor
 *
 * Executes the resolution process and persists the execution logs.
 * This is the primary entry point for MCP tool execution (though currently read-only in MVP).
 */
export class McpExecutor {
  private resolveLogsRepository: ResolveLogsRepository;

  constructor(private supabase: SupabaseClient) {
    this.resolveLogsRepository = new ResolveLogsRepository(supabase);
  }

  async execute(request: ResolveRequest): Promise<ResolveResult> {
    // 1. Orchestrate resolution
    const result = await resolvePreview(request, this.supabase);

    // 2. Persist Logs (Infra)
    await this.resolveLogsRepository.log({
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
                result.status === "blocked"
                  ? result.blocked.details
                  : undefined,
            },
    });

    return result;
  }
}
