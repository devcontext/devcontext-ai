"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Filter } from "lucide-react";

import { Input } from "@/features/shared/ui/input";
import { Button } from "@/features/shared/ui/button";
import { Badge } from "@/features/shared/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/shared/ui/popover";
import { Separator } from "@/features/shared/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/shared/ui/table";
import { DataTableViewOptions } from "@/features/shared/components/data-table/data-table-view-options";
import { DataTablePagination } from "@/features/shared/components/data-table/data-table-pagination";
import {
  ActionConfig,
  ExportBulkCsvExportProps,
} from "@/features/shared/components/data-table/types";
import { DataTableBulkActions } from "@/features/shared/components/data-table/data-table-bulk-actions";

// Type helper para obtener solo las keys que son string
type StringKeys<T> = Extract<keyof T, string>;

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig<T> {
  key: StringKeys<T>;
  label: string;
  options: FilterOption[];
  placeholder?: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKeys?: StringKeys<TData>[];
  searchPlaceholder?: string;
  filterConfigs?: FilterConfig<TData>[];
  activeFilters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableColumnVisibility?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  pageSize?: number;
  className?: string;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  leftActions?: React.ReactNode;
  // Built-in bulk actions
  bulkActions?: Array<ActionConfig<TData[]>>;
  bulkCsvExport?: ExportBulkCsvExportProps<TData>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKeys,
  searchPlaceholder = "Buscar...",
  filterConfigs,
  activeFilters = {},
  onFiltersChange,
  enableSorting = true,
  enableFiltering = true,
  enableColumnVisibility = true,
  enablePagination = true,
  enableRowSelection = false,
  pageSize = 15,
  className,
  onRowSelectionChange,
  leftActions,
  bulkActions,
  bulkCsvExport,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  // Gestionar filtros: estado interno con sincronización para respuesta inmediata
  const [internalActiveFilters, setInternalActiveFilters] = React.useState<
    Record<string, string>
  >(activeFilters || {});

  const activeFiltersKey = React.useMemo(
    () => JSON.stringify(activeFilters || {}),
    [activeFilters],
  );

  React.useEffect(() => {
    setInternalActiveFilters(activeFilters || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFiltersKey]);

  const effectiveActiveFilters = internalActiveFilters;

  // Función para aplicar filtros
  const applyFilter = (key: string, value: string) => {
    const base = { ...internalActiveFilters };
    if (value === "all") {
      delete base[key];
    } else {
      base[key] = value;
    }
    setInternalActiveFilters(base);
    onFiltersChange?.(base);
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setInternalActiveFilters({});
    onFiltersChange?.({});
    setIsFiltersOpen(false);
  };

  // Contar filtros activos
  const activeFiltersCount = Object.keys(effectiveActiveFilters).length;
  const hasActiveFilters = activeFiltersCount > 0;

  // Filtrado cliente basado en filterConfigs + activeFilters
  const clientFilteredData = React.useMemo(() => {
    if (
      !enableFiltering ||
      !filterConfigs ||
      Object.keys(effectiveActiveFilters).length === 0
    ) {
      return data;
    }

    const entries = Object.entries(effectiveActiveFilters);
    if (entries.length === 0) return data;

    return data.filter((row) => {
      const record = row as unknown as Record<string, unknown>;
      return entries.every(([key, value]) => {
        const rowValue = record[key];
        if (rowValue === undefined || rowValue === null) return false;

        // Normalización básica para booleanos
        if (typeof rowValue === "boolean") {
          return String(rowValue) === value;
        }

        return String(rowValue) === String(value);
      });
    });
  }, [data, enableFiltering, filterConfigs, effectiveActiveFilters]);

  const table = useReactTable({
    data: clientFilteredData,
    columns,
    enableMultiSort: true,
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: enableFiltering ? setColumnFilters : undefined,
    onGlobalFilterChange: enableFiltering ? setGlobalFilter : undefined,
    globalFilterFn: (row, columnId, filterValue) => {
      // Si no hay searchKeys definidas, buscar en todas las columnas
      const keysToSearch =
        searchKeys && searchKeys.length > 0
          ? searchKeys
          : (columns
              .map((col) => {
                if (
                  "accessorKey" in col &&
                  typeof col.accessorKey === "string"
                ) {
                  return col.accessorKey as StringKeys<TData>;
                }
                return null;
              })
              .filter(Boolean) as StringKeys<TData>[]);

      // Buscar en los campos especificados
      return keysToSearch.some((key) => {
        const value = row.getValue(key as string);
        return (
          value &&
          String(value).toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    onColumnVisibilityChange: enableColumnVisibility
      ? setColumnVisibility
      : undefined,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    state: {
      sorting: enableSorting ? sorting : undefined,
      columnFilters: enableFiltering ? columnFilters : undefined,
      columnVisibility: enableColumnVisibility ? columnVisibility : undefined,
      rowSelection: enableRowSelection ? rowSelection : undefined,
      globalFilter: enableFiltering ? globalFilter : undefined,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Callback for selected rows (avoid loops by detecting actual changes)
  const lastSelectedKeyRef = React.useRef<string>("");
  React.useEffect(() => {
    if (!enableRowSelection || !onRowSelectionChange) return;

    try {
      const filteredSelectedRowModel = table.getFilteredSelectedRowModel();
      if (!filteredSelectedRowModel || !filteredSelectedRowModel.rows) {
        return;
      }
      const selected = filteredSelectedRowModel.rows;
      const selectedKey = selected.map((r) => r.id).join("|");

      if (selectedKey !== lastSelectedKeyRef.current) {
        lastSelectedKeyRef.current = selectedKey;
        const selectedData = selected.map((row) => row.original);
        onRowSelectionChange(selectedData);
      }
    } catch (error) {
      console.error("Error in row selection effect:", error);
    }
  }, [rowSelection, enableRowSelection, onRowSelectionChange, table]);

  // Selected rows data for bulk actions
  const selectedRowsData = React.useMemo(() => {
    // Solo calcular si rowSelection está habilitado
    if (!enableRowSelection) {
      return [];
    }
    try {
      const filteredSelectedRowModel = table.getFilteredSelectedRowModel();
      if (!filteredSelectedRowModel || !filteredSelectedRowModel.rows) {
        return [];
      }
      return filteredSelectedRowModel.rows.map((row) => row.original as TData);
    } catch (error) {
      console.error("Error getting selected rows:", error);
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection, table, enableRowSelection]);

  return (
    <div className={`w-full ${className || ""}`}>
      {/* Toolbar */}
      <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-2 min-w-0 sm:order-1 sm:min-w-70">
          {enableFiltering && (
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="h-9 w-full sm:max-w-lg"
            />
          )}
        </div>

        {/* Acciones + Filtros (mobile-first: arriba) */}
        <div className="order-1 flex flex-wrap items-center gap-2 justify-between sm:order-2 sm:justify-end">
          {/* Built-in bulk actions when there is a selection */}
          {enableRowSelection ? (
            <DataTableBulkActions
              table={table}
              actions={bulkActions}
              bulkCsvExport={bulkCsvExport}
              selectedRowsData={selectedRowsData}
            />
          ) : null}

          {leftActions}
          {/* Botón de Filtros */}
          {filterConfigs && filterConfigs.length > 0 && (
            <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filtros</span>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 px-1 py-0 h-5">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-3">
                <div className="space-y-4">
                  {filterConfigs.map((config) => (
                    <div
                      key={config.key as string}
                      className="space-y-2 w-full"
                    >
                      <h4 className="text-sm font-medium">{config.label}</h4>
                      <Select
                        value={
                          effectiveActiveFilters[config.key as string] || "all"
                        }
                        onValueChange={(value) =>
                          applyFilter(config.key as string, value)
                        }
                      >
                        <SelectTrigger className="h-8 w-full">
                          <SelectValue
                            placeholder={config.placeholder || "Todos"}
                          />
                        </SelectTrigger>
                        <SelectContent className="w-(--radix-select-trigger-width) min-w-full">
                          <SelectItem value="all">Todos</SelectItem>
                          {config.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}

                  {hasActiveFilters && (
                    <>
                      <Separator />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={clearAllFilters}
                      >
                        Limpiar filtros
                      </Button>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Botón View Options */}
          {enableColumnVisibility && <DataTableViewOptions table={table} />}
        </div>
      </div>

      {/* Badges de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1 mb-3">
          {Object.entries(effectiveActiveFilters).map(([key, value]) => {
            const config = filterConfigs?.find((c) => c.key === key);
            const option = config?.options.find((o) => o.value === value);
            return (
              <Badge key={key} variant="secondary" className="h-7">
                {config?.label}: {option?.label || value}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => applyFilter(key, "all")}
                  aria-label={`Eliminar filtro de ${config?.label}`}
                >
                  ×
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={
                    enableRowSelection && row.getIsSelected()
                      ? "selected"
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Solo mostrar si hay más elementos que el tamaño de página */}
      {enablePagination &&
        table.getFilteredRowModel().rows.length > pageSize && (
          <DataTablePagination
            table={table}
            showSelectedCount={enableRowSelection}
          />
        )}
    </div>
  );
}
