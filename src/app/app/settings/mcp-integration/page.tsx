import Link from "next/link";
import { PageContainer } from "@/features/shared/components/page-container";
import { McpConfigSnippet } from "@/features/mcp/components/mcp-config-snippet";
import { settingsRoutes } from "@/features/settings/routes";

export default function McpIntegrationPage() {
  return (
    <PageContainer
      title={settingsRoutes.mcpIntegration.title}
      description={settingsRoutes.mcpIntegration.description}
      size="lg"
      className="flex-1"
    >
      <div className="max-w-4xl space-y-8">
        <McpConfigSnippet accessToken="your-access-token-here" />

        <div className="p-4 bg-muted/50 border border-border rounded-lg text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> You will need an active access token to
            complete the configuration. You can manage your tokens in the{" "}
            <Link
              href={settingsRoutes.accessTokens.path}
              className="text-primary hover:underline"
            >
              Access Tokens
            </Link>{" "}
            tab.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
