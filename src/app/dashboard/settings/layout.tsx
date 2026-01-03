import { SettingsTabs } from "@/features/settings/components/settings-tabs";

const SettingsLayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SettingsTabs />
      {children}
    </>
  );
};

export default SettingsLayoutPage;
