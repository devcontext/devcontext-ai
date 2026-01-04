import { SettingsContent } from "@/features/settings/components/settings-content";
import { listUserApiKeys } from "@/features/core/app/api-keys/list-user-api-keys";
import { requireUser } from "@/features/auth/utils/get-user";
import { createSupabaseServerClient } from "@/features/core/infra/supabase-server";
import { PageContainer } from "@/features/shared/components/page-container";

export default async function SettingsPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const apiKeys = await listUserApiKeys(supabase, user.id);

  return (
    <PageContainer
      title="Settings"
      description="Manage your API keys and integrations."
    >
      <SettingsContent apiKeys={apiKeys} />
    </PageContainer>
  );
}
