"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { AccessTokenListItem } from "../types";
import { TokenList } from "./token-list";
import { GenerateTokenDialog } from "./generate-token-dialog";
import { McpConfigSnippet } from "@/features/mcp/components/mcp-config-snippet";
import {
  generateAccessTokenAction,
  revokeAccessTokenAction,
} from "../actions/token-actions";

const projectUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface AccessTokensContentProps {
  tokens: AccessTokenListItem[];
}

export function AccessTokensContent({
  tokens: initialTokens,
}: AccessTokensContentProps) {
  const [tokens, setTokens] = useState(initialTokens);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTokenName, setDialogTokenName] = useState("");
  const [regeneratingTokenId, setRegeneratingTokenId] = useState<string | null>(
    null,
  );
  const [firstToken, setFirstToken] = useState<string | null>(
    initialTokens.length > 0 ? "your-access-token-here" : null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (name: string) => {
    setError(null);
    const result = await generateAccessTokenAction(name);

    if (result.success && result.data?.token) {
      // Store the first generated token for MCP config display
      setFirstToken(result.data.token);

      // Don't reload immediately - let the dialog show the token
      // The dialog will handle closing and then we can refresh
    } else if (!result.success) {
      setError(result.error || "Failed to generate access token");
    }

    return result;
  };

  const handleRegenerate = async (id: string, name: string) => {
    setError(null);
    setRegeneratingTokenId(id);

    // First revoke the old token
    const revokeResult = await revokeAccessTokenAction(id);

    if (!revokeResult.success) {
      setError(revokeResult.error || "Failed to revoke old token");
      setRegeneratingTokenId(null);
      return;
    }

    // Remove from list immediately
    setTokens((prev) => prev.filter((token) => token.id !== id));

    // Open dialog with the same name to generate new token
    setDialogTokenName(name);
    setIsDialogOpen(true);
    setRegeneratingTokenId(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDialogTokenName("");
    // Refresh to get updated list after dialog closes
    window.location.reload();
  };

  const handleRevoke = async (id: string) => {
    setError(null);
    const result = await revokeAccessTokenAction(id);

    if (result.success) {
      // Remove the revoked token from the list
      setTokens((prev) => prev.filter((token) => token.id !== id));
    } else {
      setError(result.error || "Failed to revoke access token");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Generate Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Access Tokens
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Tokens to access contexts via MCP
          </p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          Generate Token
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Access Tokens Section */}
      <section>
        <TokenList
          tokens={tokens}
          onRevoke={handleRevoke}
          onRegenerate={handleRegenerate}
        />
      </section>

      {/* MCP Integration Section */}
      {firstToken && (
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
            <McpConfigSnippet
              accessToken={firstToken}
              projectUrl={projectUrl}
            />
          </div>
        </section>
      )}

      {/* Generate Token Dialog */}
      <GenerateTokenDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onGenerate={handleGenerate}
        initialName={dialogTokenName}
      />
    </div>
  );
}
