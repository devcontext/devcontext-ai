import { Button } from "@/features/shared/ui/button";
import { ActionConfig } from "../types";
import { Loader2 } from "lucide-react";

interface BulkActionProps<TData> {
  action: ActionConfig<TData>;
  onClick: (index: number) => void;
  index: number;
  isLoading: boolean;
}

export const BulkAction = <TData,>({
  action,
  index,
  onClick,
  isLoading,
}: BulkActionProps<TData>) => {
  return (
    <Button
      variant={"destructive-outline"}
      size="sm"
      className="h-9 gap-1 shrink-0"
      onClick={() => onClick(index)}
      disabled={isLoading}
    >
      {action.icon && !isLoading && <action.icon className="h-3.5 w-3.5" />}
      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      <span>{action.label}</span>
    </Button>
  );
};
