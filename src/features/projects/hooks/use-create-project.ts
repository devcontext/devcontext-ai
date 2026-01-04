"use client";

import { useState } from "react";
import { createProjectAction } from "../actions/project-actions";
import type { Project } from "@/features/core/domain/types/projects";
import type { CreateProjectInput } from "@/features/core/domain/validation/project-validation";

interface UseCreateProjectReturn {
  createProject: (input: CreateProjectInput) => Promise<Project | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to create a new project
 */
export function useCreateProject(): UseCreateProjectReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (
    input: CreateProjectInput,
  ): Promise<Project | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await createProjectAction(input);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || "Failed to create project");
        return null;
      }
    } catch (err) {
      setError("An unexpected error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProject,
    loading,
    error,
  };
}
