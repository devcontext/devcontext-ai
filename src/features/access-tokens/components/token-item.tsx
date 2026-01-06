"use client";

import { Trash2, RotateCw } from "lucide-react";

interface TokenItemProps {
  id: string;
  name: string;
  createdAt: Date;
  lastUsedAt: Date | null;
  onRevoke: (id: string) => void;
  onRegenerate: (id: string, name: string) => void;
  isRevoking: boolean;
  isRegenerating: boolean;
}

export function TokenItem({
  id,
  name,
  createdAt,
  lastUsedAt,
  onRevoke,
  onRegenerate,
  isRevoking,
  isRegenerating,
}: TokenItemProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{name}</h3>
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          <p>Created: {formatDate(createdAt)}</p>
          {lastUsedAt && <p>Last used: {formatDate(lastUsedAt)}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onRegenerate(id, name)}
          disabled={isRegenerating || isRevoking}
          className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Regenerate this access token"
        >
          <RotateCw
            size={16}
            className={isRegenerating ? "animate-spin" : ""}
          />
          {isRegenerating ? "Regenerating..." : "Regenerate"}
        </button>
        <button
          onClick={() => onRevoke(id)}
          disabled={isRevoking || isRegenerating}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Revoke this access token"
        >
          <Trash2 size={16} />
          {isRevoking ? "Revoking..." : "Revoke"}
        </button>
      </div>
    </div>
  );
}
