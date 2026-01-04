"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus, Search, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/ui/dropdown-menu";
import { Input } from "@/features/shared/ui/input";
import { ProjectList } from "./project-list";
import { cn } from "@/features/shared/lib/utils";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import type { Project } from "@/features/core/domain/types/projects";

const CURRENT_PROJECT_KEY = "devcontextai:current-project-id";

export function ProjectSelector() {
  const { projects, loading, error, refetch } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // Load current project from localStorage on mount
  useEffect(() => {
    const savedProjectId = localStorage.getItem(CURRENT_PROJECT_KEY);
    if (savedProjectId) {
      setCurrentProjectId(savedProjectId);
    } else if (projects.length > 0) {
      // Auto-select first project if none selected
      const firstProject = projects[0];
      if (firstProject) {
        setCurrentProjectId(firstProject.id);
        localStorage.setItem(CURRENT_PROJECT_KEY, firstProject.id);
      }
    }
  }, [projects]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const currentProject = projects.find((p) => p.id === currentProjectId);

  const handleProjectSelect = (project: Project) => {
    setCurrentProjectId(project.id);
    localStorage.setItem(CURRENT_PROJECT_KEY, project.id);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleCreateClick = () => {
    setIsOpen(false);
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    refetch(); // Refresh project list
  };

  const hasProjects = filteredProjects.length > 0;

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent cursor-pointer transition-colors text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
            {
              "bg-accent": isOpen,
            },
          )}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <span>{currentProject?.name || "Select Project"}</span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-70">
          {hasProjects ? (
            <div className="px-2 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Find project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
          ) : null}

          <div className="px-1">
            {hasProjects ? (
              <div className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1.5">
                Projects
              </div>
            ) : null}
            {error ? (
              <div className="px-3 py-6 text-center text-sm text-destructive">
                {error}
              </div>
            ) : filteredProjects.length > 0 ? (
              <ProjectList
                projects={filteredProjects}
                currentProjectId={currentProjectId}
                onProjectSelect={handleProjectSelect}
              />
            ) : (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                {searchQuery ? "No projects found" : "No projects yet"}
              </div>
            )}
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleCreateClick}
            className="gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateProjectModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
