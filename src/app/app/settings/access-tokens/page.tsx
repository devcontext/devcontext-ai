import { AccessTokensContent } from "@/features/access-tokens/components/access-tokens-content";
import { listAccessTokensAction } from "@/features/access-tokens/actions/token-actions";
import { requireUser } from "@/features/auth/utils/get-user";
import { PageContainer } from "@/features/shared/components/page-container";

export default async function AccessTokensPage() {
  await requireUser();

  const result = await listAccessTokensAction();
  const tokens = result.success ? result.data! : [];

  return (
    <PageContainer size="lg" className="flex-1">
      <AccessTokensContent tokens={tokens} />
    </PageContainer>
  );
}
