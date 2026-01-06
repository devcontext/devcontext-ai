import { ExportBulkCsvExportProps } from "@/features/shared/components/data-table/types";
import { Button } from "@/features/shared/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";

interface IExportToCsvActionProps<TData> {
  action?: ExportBulkCsvExportProps<TData>;
  selectedRowsData: TData[];
}

export const ExportToCsvAction = <TData,>({
  action,
  selectedRowsData,
}: IExportToCsvActionProps<TData>) => {
  const [isLoading, setIsLoading] = useState(false);

  const exportCsvIfConfigured = () => {
    if (!action) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const rows = selectedRowsData.map((r) => action.mapRow(r));
      if (rows.length === 0) {
        return;
      }

      const headers = Array.from(
        rows.reduce<Set<string>>((set, row) => {
          Object.keys(row).forEach((k) => set.add(k));
          return set;
        }, new Set()),
      );
      const escape = (value: unknown) => {
        const str = value == null ? "" : String(value);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      };
      const csv = [
        headers.join(","),
        ...rows.map((row) =>
          headers
            .map((h) => escape((row as Record<string, unknown>)[h]))
            .join(","),
        ),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${action.filename || "export"}-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      setIsLoading(false);
    }, 1000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-9 gap-1 shrink-0"
      onClick={exportCsvIfConfigured}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <FileDown className="h-3.5 w-3.5" />
      )}
      <span>{action?.label || "Exportar CSV"}</span>
    </Button>
  );
};
