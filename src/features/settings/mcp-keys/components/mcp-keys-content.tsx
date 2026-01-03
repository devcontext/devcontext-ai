import { McpKeyListItem } from "@/features/core/domain/api-keys/types";
import { MCPKeysEmptyState } from "@/features/settings/mcp-keys/components/keys-empty-state";

interface McpKeysContentProps {
  keys: McpKeyListItem[];
}

export const McpKeysContent: React.FC<McpKeysContentProps> = ({ keys }) => {
  return <p>MCP Keys Content</p>;
};
