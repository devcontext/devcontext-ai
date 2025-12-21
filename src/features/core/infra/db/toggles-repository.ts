import { supabase } from "@/features/core/infra/db/supabase-client";

export const togglesRepository = {
  async getByProject(projectId: string): Promise<Record<string, boolean>> {
    const { data, error } = await supabase
      .from("project_rule_toggles")
      .select("rule_id, enabled")
      .eq("project_id", projectId);

    if (error || !data) return {};

    return data.reduce((acc, curr) => {
      acc[curr.rule_id] = curr.enabled;
      return acc;
    }, {} as Record<string, boolean>);
  },

  async setToggle(projectId: string, ruleId: string, enabled: boolean): Promise<void> {
    const { error } = await supabase
      .from("project_rule_toggles")
      .upsert({
        project_id: projectId,
        rule_id: ruleId,
        enabled: enabled,
      }, { onConflict: "project_id,rule_id" });

    if (error) {
      console.error("Error setting toggle:", error);
    }
  },
};
