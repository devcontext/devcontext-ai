"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Key } from "lucide-react";
import type { AccessTokenListItem } from "@/features/core/domain/types/access-tokens";
import { TokenList } from "./token-list";
import { GenerateTokenDialog } from "./generate-token-dialog";
import { McpConfigSnippet } from "@/features/mcp/components/mcp-config-snippet";
import { Button } from "@/features/shared/ui/button";
import { EmptyState } from "@/features/shared/components/empty-state";
import { useToast } from "@/features/shared/hooks/use-toast";
import {
  generateAccessTokenAction,
  revokeAccessTokenAction,
} from "../actions/token-actions";
import type { GenerateTokenValues } from "../schemas";

interface AccessTokensContentProps {
  tokens: AccessTokenListItem[];
}

export function AccessTokensContent({
  tokens: initialTokens,
}: AccessTokensContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [tokens, setTokens] = useState(initialTokens);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTokenName, setDialogTokenName] = useState("");
  const [firstToken, setFirstToken] = useState<string | null>(
    initialTokens.length > 0 ? "your-access-token-here" : null,
  );
  const [error, setError] = useState<string | null>(null);

  // Synchronize state with props when they change (e.g. after router.refresh())
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTokens(initialTokens);
    // If we have tokens now but didn't have a placeholder for firstToken, set it
    if (initialTokens.length > 0 && !firstToken) {
      setFirstToken("your-access-token-here");
    }
  }, [initialTokens, firstToken]);

  const handleGenerate = async (values: GenerateTokenValues) => {
    setError(null);
    const result = await generateAccessTokenAction(values);

    if (result.success && result.data?.token) {
      setFirstToken(result.data.token);
      toast({
        title: "Token generated",
        description: `Access token "${values.name}" has been created.`,
        variant: "success",
      });
    } else if (!result.success) {
      toast({
        title: "Error",
        description: result.error || "Failed to generate access token",
        variant: "destructive",
      });
      setError(result.error || "Failed to generate access token");
    }

    return result;
  };

  const handleRegenerate = async (id: string, name: string) => {
    setError(null);

    const revokeResult = await revokeAccessTokenAction(id);

    if (!revokeResult.success) {
      toast({
        title: "Error",
        description: revokeResult.error || "Failed to revoke old token",
        variant: "destructive",
      });
      setError(revokeResult.error || "Failed to revoke old token");
      return;
    }

    setTokens((prev: AccessTokenListItem[]) =>
      prev.filter((token: AccessTokenListItem) => token.id !== id),
    );
    setDialogTokenName(name);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDialogTokenName("");
    router.refresh();
  };

  const handleRevoke = async (id: string) => {
    setError(null);
    const result = await revokeAccessTokenAction(id);

    if (result.success) {
      toast({
        title: "Token revoked",
        description: "The access token has been successfully revoked.",
        variant: "success",
      });
      const newTokens = tokens.filter(
        (token: AccessTokenListItem) => token.id !== id,
      );
      setTokens(newTokens);
      // If no tokens left, we refresh to show empty state from page level
      if (newTokens.length === 0) {
        router.refresh();
      }
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to revoke access token",
        variant: "destructive",
      });
      setError(result.error || "Failed to revoke access token");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Content Area */}
      {tokens.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center -mt-12">
          <EmptyState
            title="No access tokens"
            description="Generate your first token to start using the MCP integration with your IDE."
            icon={Key}
            fullHeight
            actions={[
              {
                text: "Generate Token",
                onClick: () => setIsDialogOpen(true),
              },
            ]}
          />
        </div>
      ) : (
        <div className="space-y-8 flex-1 flex flex-col">
          {/* Header with Generate Button */}
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Your Access Tokens
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Create tokens to access your contexts via MCP
              </p>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={16} />
              Generate Token
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg shrink-0">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Access Tokens List */}
          <div className="flex-1">
            <TokenList
              tokens={tokens}
              onRevoke={handleRevoke}
              onRegenerate={handleRegenerate}
            />
          </div>

          {/* MCP Integration Section */}
          {firstToken && (
            <div className="space-y-4 shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  MCP Integration
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure your IDE to connect to DevContext AI
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <McpConfigSnippet accessToken={firstToken} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generate Token Dialog - Kept outside for stable mount state */}
      <GenerateTokenDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onGenerate={handleGenerate}
        initialName={dialogTokenName}
      />
    </div>
  );
}
