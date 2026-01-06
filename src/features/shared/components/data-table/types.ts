import * as React from "react";
import { ColumnDef, Column, Table, Row } from "@tanstack/react-table";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableColumnVisibility?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  pageSize?: number;
  className?: string;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
}

export interface ConfirmConfig<TData> {
  title: string;
  description?: React.ReactNode | ((payload: TData) => React.ReactNode);
  confirmText?: string;
  cancelText?: string;
}

export interface ActionConfig<TData> {
  confirm?: ConfirmConfig<TData>;
  icon?: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
  label: string;
  url?: string | ((data: TData) => string);
  onClick: (data: TData) => void | Promise<void>;
  variant?: "default" | "destructive";
  type?: "confirm" | "default";
}

export interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions?: ActionConfig<TData>[];
}

export interface ExportBulkCsvExportProps<TData> {
  filename?: string;
  mapRow: (row: TData) => Record<string, unknown>;
  label?: string;
  isLoading?: boolean;
}
