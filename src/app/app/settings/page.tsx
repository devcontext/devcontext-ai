import { requireUser } from "@/features/auth/utils/get-user";
import { PageContainer } from "@/features/shared/components/page-container";

export default async function SettingsPage() {
  await requireUser();

  return (
    <PageContainer
      title="General"
      description="General account settings"
      size="lg"
    >
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-muted-foreground text-sm">
          General settings and preferences will be available here.
        </p>
      </div>
    </PageContainer>
  );
}
