"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ContextFilters, FilterValues } from "./context-filters";
import { Project } from "../../../core/domain/types/projects";

interface FilterContainerProps {
  projects: Project[];
  initialValues: {
    search?: string;
    projectId?: string;
    tags?: string;
  };
}

export function FilterContainer({
  projects,
  initialValues,
}: FilterContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (values: FilterValues) => {
    const params = new URLSearchParams(searchParams.toString());

    if (values.search) params.set("search", values.search);
    else params.delete("search");

    if (values.projectId) params.set("projectId", values.projectId);
    else params.delete("projectId");

    if (values.tags) params.set("tags", values.tags);
    else params.delete("tags");

    router.push(`/dashboard/contexts?${params.toString()}`);
  };

  return (
    <ContextFilters projects={projects} onFilterChange={handleFilterChange} />
  );
}
