"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Key } from "lucide-react";
import type { AccessTokenListItem } from "@/features/core/domain/types/access-tokens";
import { TokenList } from "./token-list";
import { GenerateTokenDialog } from "./generate-token-dialog";
import { Button } from "@/features/shared/ui/button";
import { EmptyState } from "@/features/shared/components/empty-state";
import { useToast } from "@/features/shared/hooks/use-toast";
import {
  generateAccessTokenAction,
  revokeAccessTokenAction,
  regenerateAccessTokenAction,
} from "../actions/token-actions";
import type { GenerateTokenValues } from "../schemas";
import { settingsRoutes } from "@/features/settings/routes";
import { PageContainerHeader } from "@/features/shared/components/page-container/page-container-header";

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
  const [regeneratedToken, setRegeneratedToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Synchronize state with props when they change (e.g. after router.refresh())
  useEffect(() => {
    setTokens(initialTokens);
  }, [initialTokens]);

  const handleGenerate = async (values: GenerateTokenValues) => {
    setError(null);
    const result = await generateAccessTokenAction(values);

    if (result.success && result.data?.token) {
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

    const result = await regenerateAccessTokenAction(id, name);

    if (result.success && result.data?.token) {
      setRegeneratedToken(result.data.token);
      setDialogTokenName(name);
      setIsDialogOpen(true);
      toast({
        title: "Token regenerated",
        description: `Access token "${name}" has been replaced.`,
        variant: "success",
      });
    } else {
      const errorMsg = result.error || "Failed to regenerate access token";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      setError(errorMsg);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDialogTokenName("");
    setRegeneratedToken(null);
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
          <PageContainerHeader
            title={settingsRoutes.accessTokens.title}
            description={settingsRoutes.accessTokens.description}
          >
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={16} />
              Generate Token
            </Button>
          </PageContainerHeader>

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

          {/* MCP Integration Help Link */}
          <div className="p-6 bg-muted/30 border border-border rounded-xl flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">
                Need help setting this up?
              </h3>
              <p className="text-sm text-muted-foreground">
                Follow our step-by-step guides to integrate DevContext AI with
                your IDE.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/app/settings/mcp-integration")}
              className="gap-2"
            >
              MCP Integration
              <Plus className="rotate-45" size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Generate Token Dialog - Kept outside for stable mount state */}
      <GenerateTokenDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onGenerate={handleGenerate}
        initialName={dialogTokenName}
        initialToken={regeneratedToken}
      />
    </div>
  );
}
