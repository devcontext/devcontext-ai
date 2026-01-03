"use client";

import { GenerateKeyDialog } from "@/features/settings/mcp-keys/components/generate-key-dialog";
import { settingsRoutes } from "@/features/settings/routes";
import { EmptyState } from "@/features/shared/components/empty-state";
import { FilePlus, KeyIcon } from "lucide-react";
import { useState } from "react";

export const MCPKeysEmptyState = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <EmptyState
      title="No MCP keys found"
      description="You have not created any MCP keys yet."
      icon={KeyIcon}
    >
      <GenerateKeyDialog onClose={() => setIsOpen(false)} />
    </EmptyState>
  );
};
