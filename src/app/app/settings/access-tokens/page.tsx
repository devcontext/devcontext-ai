import { AccessTokensContent } from "@/features/access-tokens/components/access-tokens-content";
import { listUserTokens } from "@/features/access-tokens/services/list-user-tokens";
import { requireUser } from "@/features/auth/utils/get-user";
import { createSupabaseServerClient } from "@/features/core/infra/supabase-server";
import { PageContainer } from "@/features/shared/components/page-container";

export default async function AccessTokensPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const tokens = await listUserTokens(supabase, user.id);

  return (
    <PageContainer
      title="Access Tokens"
      description="Tokens to access contexts via MCP"
    >
      <AccessTokensContent tokens={tokens} />
    </PageContainer>
  );
}
