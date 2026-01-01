"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { ApiKeyListItem } from "@/features/core/domain/api-keys/types";
import { ApiKeyList } from "@/features/settings/components/api-key-list";
import { GenerateKeyDialog } from "@/features/settings/components/generate-key-dialog";
import { McpConfigSnippet } from "@/features/settings/components/mcp-config-snippet";
import {
  generateApiKeyAction,
  revokeApiKeyAction,
} from "@/features/settings/actions/api-key-actions";

interface SettingsContentProps {
  apiKeys: ApiKeyListItem[];
  projectUrl: string;
}

export function SettingsContent({
  apiKeys: initialApiKeys,
  projectUrl,
}: SettingsContentProps) {
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [firstApiKey, setFirstApiKey] = useState<string | null>(
    initialApiKeys.length > 0 ? "your-api-key-here" : null,
  );

  const handleGenerate = async (name: string) => {
    const result = await generateApiKeyAction(name);

    if (result.success && result.apiKey) {
      // Store the first generated key for MCP config display
      setFirstApiKey(result.apiKey);

      // Refresh the page to get updated list
      window.location.reload();
    }

    return result;
  };

  const handleRevoke = async (id: string) => {
    await revokeApiKeyAction(id);
    // Refresh the page to get updated list
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* API Keys Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              API Keys
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your API keys for MCP integration
            </p>
          </div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Generate New Key
          </button>
        </div>

        <ApiKeyList apiKeys={apiKeys} onRevoke={handleRevoke} />
      </section>

      {/* MCP Integration Section */}
      {firstApiKey && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              MCP Integration
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Configure your IDE to connect to DevContext AI
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <McpConfigSnippet apiKey={firstApiKey} projectUrl={projectUrl} />
          </div>
        </section>
      )}

      {/* Generate Key Dialog */}
      <GenerateKeyDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onGenerate={handleGenerate}
      />
    </div>
  );
}
