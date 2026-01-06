"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { listProjectsAction } from "@/features/projects/actions/project-actions";
import type { Project } from "@/features/core/domain/types/projects";

interface AppContextValue {
  // Projects state and actions
  projects: {
    list: Project[];
    loading: boolean;
    activeProject: Project | null;
    setActiveProject: (project: Project | null) => void;
    addProject: (project: Project) => void;
    refreshProjects: () => Promise<void>;
  };

  // UI state
  ui: {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
  };
}

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: ReactNode;
  initialProjects: Project[];
}

export function AppProvider({ children, initialProjects }: AppProviderProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("devcontext_active_project");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && "id" in parsed) {
          setActiveProject(parsed as Project);
        }
      } catch (e) {
        console.error("Failed to parse active project from storage", e);
      }
    }
  }, []);

  // Save to localStorage whenever activeProject changes
  useEffect(() => {
    if (activeProject) {
      localStorage.setItem(
        "devcontext_active_project",
        JSON.stringify(activeProject),
      );
    } else {
      localStorage.removeItem("devcontext_active_project");
    }
  }, [activeProject]);

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
      activeProject,
      setActiveProject,
      addProject,
      refreshProjects,
    },
    ui: {
      isMobileMenuOpen,
      setIsMobileMenuOpen,
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
