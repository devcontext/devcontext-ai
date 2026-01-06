import { requireUser } from "@/features/auth/utils/get-user";
import { PageContainer } from "@/features/shared/components/page-container";

export default async function SettingsPage() {
  await requireUser();

  return (
    <PageContainer
      title="Settings"
      description="Manage your settings and integrations."
    >
      <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          Select a section from the tabs above to manage your settings.
        </p>
      </div>
    </PageContainer>
  );
}
