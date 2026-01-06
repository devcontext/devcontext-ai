"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Project } from "@/features/core/domain/types/projects";

interface ProjectContextValue {
  project: Project;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

interface ProjectProviderProps {
  children: ReactNode;
  project: Project;
}

export function ProjectProvider({ children, project }: ProjectProviderProps) {
  return (
    <ProjectContext.Provider value={{ project }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useCurrentProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useCurrentProject must be used within ProjectProvider");
  }
  return context.project;
}
