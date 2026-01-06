"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RotateCw, Trash2 } from "lucide-react";
import type { AccessTokenListItem } from "@/features/core/domain/types/access-tokens";
import { DataTable } from "@/features/shared/components/data-table/data-table";
import { DataTableRowActions } from "@/features/shared/components/data-table/data-table-row-actions";

interface TokenListProps {
  tokens: AccessTokenListItem[];
  onRevoke: (id: string) => Promise<void>;
  onRegenerate: (id: string, name: string) => Promise<void>;
}

const formatDate = (date: Date | string | null) => {
  if (!date) return "Never";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
};

export function TokenList({ tokens, onRevoke, onRegenerate }: TokenListProps) {
  const columns: ColumnDef<AccessTokenListItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDate(row.getValue("createdAt"))}
        </span>
      ),
    },
    {
      accessorKey: "lastUsedAt",
      header: "Last Used",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDate(row.getValue("lastUsedAt"))}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={[
            {
              label: "Regenerate",
              icon: RotateCw,
              onClick: async (token) => {
                await onRegenerate(token.id, token.name);
              },
              confirm: {
                title: "Regenerate access token?",
                description: (token) => (
                  <>
                    This will permanently invalidate the current token and
                    generate a new one. Any integrations using the token{" "}
                    <strong className="font-semibold text-foreground">
                      &quot;{token.name}&quot;
                    </strong>{" "}
                    will stop working until updated.
                  </>
                ),
                confirmText: "Regenerate",
                cancelText: "Cancel",
              },
            },
            {
              label: "Revoke",
              icon: Trash2,
              variant: "destructive",
              onClick: async (token) => {
                await onRevoke(token.id);
              },
              confirm: {
                title: "Revoke access token?",
                description: (token) => (
                  <>
                    The token{" "}
                    <strong className="font-semibold text-foreground">
                      &quot;{token.name}&quot;
                    </strong>{" "}
                    will be permanently revoked and cannot be used again.
                  </>
                ),
                confirmText: "Revoke",
                cancelText: "Cancel",
              },
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tokens}
      enableFiltering={false}
      enableSorting={false}
      enableColumnVisibility={false}
      enablePagination={false}
    />
  );
}
