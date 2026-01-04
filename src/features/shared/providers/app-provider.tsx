"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { listProjectsAction } from "@/features/projects/actions/project-actions";
import type { Project } from "@/features/core/domain/types/projects";

interface AppContextValue {
  // Projects state and actions
  projects: {
    list: Project[];
    loading: boolean;
    addProject: (project: Project) => void;
    refreshProjects: () => Promise<void>;
  };

  // Space for future global state:
  // user?: User;
  // settings?: Settings;
  // notifications?: Notification[];
}

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: ReactNode;
  initialProjects: Project[];
}

export function AppProvider({ children, initialProjects }: AppProviderProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(false);

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [...prev, project]);
  }, []);

  const refreshProjects = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listProjectsAction();
      if (result.success && result.data) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error("Failed to refresh projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AppContextValue = {
    projects: {
      list: projects,
      loading,
      addProject,
      refreshProjects,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
