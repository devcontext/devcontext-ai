import { supabase } from "./supabase-client";

export type ResolveLogEntry = {
  project_id: string;
  command_id: string;
  intent_id: string;
  status: "ok" | "blocked";
  blocked_reason?: string;
  contract_text?: string;
  metadata: Record<string, unknown>;
};

export const resolveLogsRepository = {
  async log(entry: ResolveLogEntry): Promise<void> {
    const { error } = await supabase
      .from("resolve_logs")
      .insert(entry);

    if (error) {
      console.error("Error saving resolve log:", error);
    }
  },

  async getRecent(limit = 10): Promise<ResolveLogEntry[]> {
    const { data, error } = await supabase
      .from("resolve_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data as ResolveLogEntry[];
  },
};
