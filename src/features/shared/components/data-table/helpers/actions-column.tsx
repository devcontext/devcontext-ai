import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "../data-table-row-actions";
import { ActionConfig } from "../types";

interface CreateActionsColumnOptions<TData> {
  actions: ActionConfig<TData>[];
  header?: string;
}

export function createActionsColumn<TData>({
  actions,
  header = "Actions",
}: CreateActionsColumnOptions<TData>): ColumnDef<TData> {
  return {
    id: "actions",
    header,
    cell: ({ row }) => <DataTableRowActions row={row} actions={actions} />,
    enableHiding: false,
    enableSorting: false,
  };
}
