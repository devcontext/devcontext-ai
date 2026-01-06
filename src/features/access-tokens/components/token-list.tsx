"use client";

import { useState } from "react";
import type { AccessTokenListItem } from "../types";
import { TokenItem } from "./token-item";

interface TokenListProps {
  tokens: AccessTokenListItem[];
  onRevoke: (id: string) => Promise<void>;
  onRegenerate: (id: string, name: string) => Promise<void>;
}

export function TokenList({ tokens, onRevoke, onRegenerate }: TokenListProps) {
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

  if (tokens.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          No access tokens yet. Generate your first token to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tokens.map((token) => (
        <TokenItem
          key={token.id}
          id={token.id}
          name={token.name}
          createdAt={token.createdAt}
          lastUsedAt={token.lastUsedAt}
          onRevoke={handleRevoke}
          onRegenerate={handleRegenerate}
          isRevoking={revokingId === token.id}
          isRegenerating={regeneratingId === token.id}
        />
      ))}
    </div>
  );
}
