"use client";

import * as React from "react";
import { Filter } from "lucide-react";
import { Input } from "@/features/shared/ui/input";
import { Button } from "@/features/shared/ui/button";
import { Badge } from "@/features/shared/ui/badge";
import { Separator } from "@/features/shared/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/shared/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/ui/select";

export type FilterOption = { value: string; label: string };
export type FilterConfig = {
  key: string;
  label: string;
  options: FilterOption[];
  placeholder?: string;
};

interface TableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterConfigs?: FilterConfig[];
  activeFilters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
  rightActions?: React.ReactNode;
}

export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filterConfigs,
  activeFilters = {},
  onFiltersChange,
  rightActions,
}: TableToolbarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const hasFilters = (filterConfigs?.length || 0) > 0;
  const activeFiltersCount = Object.keys(activeFilters).length;
  const hasActiveFilters = activeFiltersCount > 0;

  const applyFilter = (key: string, value: string) => {
    const next = { ...activeFilters };
    if (value === "all") delete next[key];
    else next[key] = value;
    onFiltersChange?.(next);
  };

  const clearAllFilters = () => {
    onFiltersChange?.({});
    setIsFiltersOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between py-3">
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm h-9"
        />
        <div className="flex items-center gap-2">
          {hasFilters && (
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
              <PopoverContent className="w-[240px] p-3">
                <div className="space-y-4">
                  {filterConfigs?.map((config) => (
                    <div key={config.key} className="space-y-2">
                      <h4 className="text-sm font-medium">{config.label}</h4>
                      <Select
                        value={activeFilters[config.key] || "all"}
                        onValueChange={(v) => applyFilter(config.key, v)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue
                            placeholder={config.placeholder || "Todos"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {config.options.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
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
          {rightActions}
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1 mb-1">
          {Object.entries(activeFilters).map(([key, value]) => {
            const config = filterConfigs?.find((c) => c.key === key);
            const option = config?.options.find((o) => o.value === value);
            return (
              <Badge key={key} variant="secondary" className="h-7">
                {config?.label}: {option?.label || value}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => applyFilter(key, "all")}
                >
                  ×
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
