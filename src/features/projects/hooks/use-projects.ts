"use client";

import { useState, useEffect, useCallback } from "react";
import { listProjectsAction } from "../actions/project-actions";
import type { Project } from "@/features/core/domain/types/projects";

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage projects list
 */
export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await listProjectsAction();

      if (result.success && result.data) {
        setProjects(result.data);
      } else {
        setError(result.error || "Failed to load projects");
        setProjects([]);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
  };
}
