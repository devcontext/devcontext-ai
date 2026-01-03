import { listUserApiKeys } from "@/features/core/app/api-keys/list-user-api-keys";
import { SettingsContent } from "../settings-content";
import { requireUser } from "@/features/auth/utils/get-user";
import { createSupabaseServerClient } from "@/features/core/infra/supabase-server";
import { PageContainer } from "@/features/shared/components/page-container";
import { MCPKeysEmptyState } from "@/features/settings/mcp-keys/components/keys-empty-state";

export const metadata = {
  title: "API Keys | DevContext AI",
  description: "Manage your API keys and MCP integration",
};

export default async function ApiKeysPage() {
  // Get authenticated user (redirects to login if not authenticated)
  const user = await requireUser();

  // Create authenticated Supabase client
  const supabase = await createSupabaseServerClient();

  const apiKeys = await listUserApiKeys(supabase, user.id);

  if (!apiKeys || apiKeys.length === 0) {
    return <MCPKeysEmptyState />;
  }

  return (
    <PageContainer title="MCP keys" description="Manage your MCP keys">
      <SettingsContent apiKeys={apiKeys} />
    </PageContainer>
  );
}
