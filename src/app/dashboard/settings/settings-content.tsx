"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { McpKeyListItem } from "@/features/core/domain/api-keys/types";
import { ApiKeyList } from "@/features/settings/components/api-key-list";
import { GenerateKeyDialog } from "@/features/settings/components/generate-key-dialog";
import { McpConfigSnippet } from "@/features/settings/components/mcp-config-snippet";
import {
  generateApiKeyAction,
  revokeApiKeyAction,
} from "@/features/settings/actions/api-key-actions";

const projectUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface SettingsContentProps {
  apiKeys: McpKeyListItem[];
}

export function SettingsContent({
  apiKeys: initialApiKeys,
}: SettingsContentProps) {
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogKeyName, setDialogKeyName] = useState("");
  const [regeneratingKeyId, setRegeneratingKeyId] = useState<string | null>(
    null,
  );
  const [firstApiKey, setFirstApiKey] = useState<string | null>(
    initialApiKeys.length > 0 ? "your-api-key-here" : null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (name: string) => {
    setError(null);
    const result = await generateApiKeyAction(name);

    if (result.success && result.data?.key) {
      // Store the first generated key for MCP config display
      setFirstApiKey(result.data.key);

      // Don't reload immediately - let the dialog show the key
      // The dialog will handle closing and then we can refresh
    } else if (!result.success) {
      setError(result.error || "Failed to generate API key");
    }

    return result;
  };

  const handleRegenerate = async (id: string, name: string) => {
    setError(null);
    setRegeneratingKeyId(id);

    // First revoke the old key
    const revokeResult = await revokeApiKeyAction(id);

    if (!revokeResult.success) {
      setError(revokeResult.error || "Failed to revoke old key");
      setRegeneratingKeyId(null);
      return;
    }

    // Remove from list immediately
    setApiKeys((prev) => prev.filter((key) => key.id !== id));

    // Open dialog with the same name to generate new key
    setDialogKeyName(name);
    setIsDialogOpen(true);
    setRegeneratingKeyId(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDialogKeyName("");
    // Refresh to get updated list after dialog closes
    window.location.reload();
  };

  const handleRevoke = async (id: string) => {
    setError(null);
    const result = await revokeApiKeyAction(id);

    if (result.success) {
      // Remove the revoked key from the list
      setApiKeys((prev) => prev.filter((key) => key.id !== id));
    } else {
      setError(result.error || "Failed to revoke API key");
    }
  };

  return (
    <div className="space-y-8">
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* API Keys Section */}
      <section>
        <ApiKeyList
          apiKeys={apiKeys}
          onRevoke={handleRevoke}
          onRegenerate={handleRegenerate}
        />
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
        onClose={handleDialogClose}
        onGenerate={handleGenerate}
        initialName={dialogKeyName}
      />
    </div>
  );
}
