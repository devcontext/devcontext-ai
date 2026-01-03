"use client";

import { useState } from "react";
import type { McpKeyListItem } from "@/features/core/domain/api-keys/types";
import { ApiKeyItem } from "./api-key-item";

interface ApiKeyListProps {
  apiKeys: McpKeyListItem[];
  onRevoke: (id: string) => Promise<void>;
  onRegenerate: (id: string, name: string) => Promise<void>;
}

export function ApiKeyList({
  apiKeys,
  onRevoke,
  onRegenerate,
}: ApiKeyListProps) {
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    try {
      await onRevoke(id);
    } finally {
      setRevokingId(null);
    }
  };

  const handleRegenerate = async (id: string, name: string) => {
    setRegeneratingId(id);
    try {
      await onRegenerate(id, name);
    } finally {
      setRegeneratingId(null);
    }
  };

  if (apiKeys.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          No API keys yet. Generate your first key to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {apiKeys.map((apiKey) => (
        <ApiKeyItem
          key={apiKey.id}
          id={apiKey.id}
          name={apiKey.name}
          createdAt={apiKey.createdAt}
          lastUsedAt={apiKey.lastUsedAt}
          onRevoke={handleRevoke}
          onRegenerate={handleRegenerate}
          isRevoking={revokingId === apiKey.id}
          isRegenerating={regeneratingId === apiKey.id}
        />
      ))}
    </div>
  );
}
