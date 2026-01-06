// Componentes principales
export { DataTable } from './data-table';
export { DataTableColumnHeader } from './data-table-column-header';
export { DataTablePagination } from './data-table-pagination';
export { DataTableViewOptions } from './data-table-view-options';
export { DataTableRowActions } from './data-table-row-actions';
export { TableToolbar } from './table-toolbar';

// Helpers para crear columnas
export { createSelectColumn } from './helpers/select-column';
export { createActionsColumn } from './helpers/actions-column';

// Tipos útiles
export type {
  DataTableProps,
  ActionConfig,
  DataTableColumnHeaderProps,
  DataTablePaginationProps,
  DataTableViewOptionsProps,
  DataTableRowActionsProps,
} from './types';
