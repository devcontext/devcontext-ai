"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/ui/dropdown-menu";
import { Input } from "@/features/shared/ui/input";
import { ProjectList } from "./project-list";
import { cn } from "@/features/shared/utils/tailwind-utils";
import { useApp } from "@/features/shared/providers/app-provider";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import type { Project } from "@/features/core/domain/types/projects";

const CURRENT_PROJECT_KEY = "devcontextai:current-project-id";

export function ProjectSelector() {
  const {
    projects: { list: projects, loading },
  } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Initialize as null to avoid hydration mismatch (server and client match)
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  useEffect(() => {
    const savedProjectId = localStorage.getItem(CURRENT_PROJECT_KEY);

    if (savedProjectId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentProjectId(savedProjectId);
    }
  }, []);

  useEffect(() => {
    if (!loading && !currentProjectId && projects.length > 0) {
      const firstProject = projects[0];
      if (firstProject) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentProjectId(firstProject.id);
        localStorage.setItem(CURRENT_PROJECT_KEY, firstProject.id);
      }
    }
  }, [loading, currentProjectId, projects]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const currentProject = projects.find((p) => p.id === currentProjectId);

  const handleProjectSelect = (project: Project) => {
    setCurrentProjectId(project.id);
    localStorage.setItem(CURRENT_PROJECT_KEY, project.id);
    setIsOpen(false);
  };

  const handleCreateProject = () => {
    setIsOpen(false);
    setIsCreateModalOpen(true);
  };

  const handleProjectCreated = (newProject: Project) => {
    // Select the newly created project
    setCurrentProjectId(newProject.id);
    localStorage.setItem(CURRENT_PROJECT_KEY, newProject.id);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md",
              "bg-background hover:bg-accent",
              "border border-border",
              "transition-colors",
              "text-sm font-medium",
            )}
          >
            <span className="truncate max-w-30">
              {loading
                ? "Loading..."
                : currentProject?.name || "Select Project"}
            </span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-70">
          {/* Search */}
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
          </div>

          {/* Project List */}
          <ProjectList
            projects={filteredProjects}
            currentProjectId={currentProjectId}
            onProjectSelect={handleProjectSelect}
          />

          <DropdownMenuSeparator />

          {/* Create New */}
          <DropdownMenuItem
            onClick={handleCreateProject}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateProjectModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleProjectCreated}
      />
    </>
  );
}
