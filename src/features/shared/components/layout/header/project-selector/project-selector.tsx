"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Search,
  LayoutDashboard,
} from "lucide-react";
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
import { useParams, useRouter } from "next/navigation";
import { appRoutes } from "@/features/routes";

interface ProjectSelectorProps {
  fullWidth?: boolean;
}

export function ProjectSelector({ fullWidth }: ProjectSelectorProps) {
  const {
    projects: { list: projects, loading, activeProject, setActiveProject },
  } = useApp();
  const router = useRouter();
  const { projectSlug } = useParams<{ projectSlug?: string }>();

  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync with URL slug on mount or slug change
  useEffect(() => {
    if (projectSlug) {
      const project = projects.find((p) => p.slug === projectSlug);
      if (project && project.id !== activeProject?.id) {
        setActiveProject(project);
      }
    }
  }, [projectSlug, projects, activeProject, setActiveProject]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleProjectSelect = (project: Project) => {
    setActiveProject(project);
    setIsOpen(false);
    router.push(
      appRoutes.contexts.list.generatePath({ projectSlug: project.slug }),
    );
  };

  const handleClearSelection = () => {
    setActiveProject(null);
    setIsOpen(false);
    router.push(appRoutes.home.path);
  };

  const handleCreateProject = () => {
    setIsOpen(false);
    setIsCreateModalOpen(true);
  };

  const handleProjectCreated = (newProject: Project) => {
    setActiveProject(newProject);
    router.push(
      appRoutes.contexts.list.generatePath({ projectSlug: newProject.slug }),
    );
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md",
              "bg-muted/30 hover:bg-muted/50",
              "border border-border/50",
              "transition-all duration-200",
              "text-[13px] font-semibold text-foreground/80",
              !activeProject && "text-muted-foreground font-medium",
              fullWidth ? "w-full justify-between" : "w-auto",
            )}
          >
            <span
              className={cn(
                "truncate tracking-tight",
                fullWidth ? "max-w-none" : "max-w-48",
              )}
            >
              {loading ? "Loading..." : activeProject?.name || "Select Project"}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground/50 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-80 p-1 shadow-2xl border-border/60"
        >
          {/* Header Action: Go to All Projects */}
          <DropdownMenuItem
            onClick={handleClearSelection}
            className={cn(
              "cursor-pointer gap-2 py-2 px-3 text-[13px] font-medium",
              !activeProject && "bg-primary/5 text-primary",
            )}
          >
            <LayoutDashboard className="h-4 w-4 opacity-70" />
            Global Dashboard
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 opacity-50" />

          {/* Search Area */}
          <div className="px-2 py-2 mb-1">
            <div className="relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary/50 transition-colors" />
              <Input
                placeholder="Find project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-[13px] bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto px-1">
            <ProjectList
              projects={filteredProjects}
              currentProjectId={activeProject?.id}
              onProjectSelect={handleProjectSelect}
            />
          </div>

          <DropdownMenuSeparator className="my-1 opacity-50" />

          {/* Create New */}
          <DropdownMenuItem
            onClick={handleCreateProject}
            className="cursor-pointer gap-2 py-2 px-3 text-[13px] font-medium text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4 opacity-70" />
            New Project
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
