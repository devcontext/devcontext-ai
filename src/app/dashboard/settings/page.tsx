import { PageContainer } from "@/features/shared/components/page-container";

export default function SettingsPage() {
  return (
    <PageContainer title="General Settings" description="Manage your settings">
      <div className="p-6 border border-gray-200 bg-background rounded-lg">
        <p className="text-sm text-muted-foreground">
          General settings will be available here soon.
        </p>
      </div>
    </PageContainer>
  );
}
