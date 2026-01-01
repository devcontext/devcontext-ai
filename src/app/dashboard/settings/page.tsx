import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/features/core/infra/supabase-server";
import { listUserApiKeys } from "@/features/core/app/api-keys/list-user-api-keys";
import { SettingsContent } from "./settings-content";

export const metadata = {
  title: "Settings | DevContext AI",
  description: "Manage your API keys and MCP integration",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const apiKeys = await listUserApiKeys(user.id);
  const projectUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your API keys and configure MCP integration
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <SettingsContent apiKeys={apiKeys} projectUrl={projectUrl} />
      </Suspense>
    </div>
  );
}
