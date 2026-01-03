import { Table } from "@tanstack/react-table";
import { ActionConfig, ExportBulkCsvExportProps } from "../types";
import { BulkAction } from "./bulk-action";
import { ExportToCsvAction } from "./export-to-csv-action";

interface DataTableBulkActionsProps<TData> {
  table: Table<TData>;
  actions?: Array<ActionConfig<TData[]>>;
  bulkCsvExport?: ExportBulkCsvExportProps<TData>;
  selectedRowsData: TData[];
}

export const DataTableBulkActions = <TData,>({
  actions,
  table,
  selectedRowsData,
  bulkCsvExport,
}: DataTableBulkActionsProps<TData>) => {
  const hasItemsSelected =
    table.getIsSomeRowsSelected() || table.getIsAllPageRowsSelected();

  if (!actions || !hasItemsSelected) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground hidden sm:inline whitespace-nowrap">
        {selectedRowsData.length} seleccionados
      </span>

      <ExportToCsvAction
        action={bulkCsvExport}
        selectedRowsData={selectedRowsData}
      />

      {actions?.map((action, index) => {
        return (
          <BulkAction
            key={index}
            action={action}
            index={index}
            onClick={() => {
              action.onClick(selectedRowsData);
            }}
            isLoading={Boolean(action.isLoading)}
          />
        );
      })}
    </div>
  );
};
