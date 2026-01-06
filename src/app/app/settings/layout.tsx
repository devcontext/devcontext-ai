import { SettingsTabs } from "@/features/settings/components/settings-tabs";

/**
 * Layout for the settings section.
 * Provides horizontal tabs navigation for General and Access Tokens.
 */
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1">
      {/* Settings Tabs */}
      <div className="border-b border-border">
        <div className="container mx-auto max-w-7xl px-6">
          <SettingsTabs />
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
