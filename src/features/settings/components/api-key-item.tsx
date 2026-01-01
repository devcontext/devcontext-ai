"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ApiKeyItemProps {
  id: string;
  name: string;
  createdAt: Date;
  lastUsedAt: Date | null;
  onRevoke: (id: string) => void;
  isRevoking: boolean;
}

export function ApiKeyItem({
  id,
  name,
  createdAt,
  lastUsedAt,
  onRevoke,
  isRevoking,
}: ApiKeyItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRevoke = () => {
    onRevoke(id);
    setShowConfirm(false);
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{name}</h3>
        <div className="flex gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
          <span>
            Created {formatDistanceToNow(createdAt, { addSuffix: true })}
          </span>
          {lastUsedAt && (
            <span>
              Last used {formatDistanceToNow(lastUsedAt, { addSuffix: true })}
            </span>
          )}
          {!lastUsedAt && (
            <span className="text-gray-400 dark:text-gray-500">Never used</span>
          )}
        </div>
      </div>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isRevoking}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
        >
          <Trash2 size={16} />
          Revoke
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure?
          </span>
          <button
            onClick={handleRevoke}
            disabled={isRevoking}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isRevoking ? "Revoking..." : "Yes, revoke"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isRevoking}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
