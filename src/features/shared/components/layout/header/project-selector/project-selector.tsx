"use client";

import { useState } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/ui/dropdown-menu";
import { Input } from "@/features/shared/ui/input";
import { ProjectList } from "./project-list";
import type { ProjectSelectorProps, Project } from "./types";

// Mock data - replace with actual data source
const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "crac-monorepo", description: "Main monorepo project" },
  { id: "2", name: "design-system", description: "UI component library" },
  { id: "3", name: "backend-api", description: "REST API services" },
  { id: "4", name: "mobile-app", description: "React Native application" },
];

export function ProjectSelector({
  currentProject,
  projects = MOCK_PROJECTS,
  onProjectChange,
  onCreateProject,
}: ProjectSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleProjectSelect = (project: Project) => {
    onProjectChange?.(project);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleCreateProject = () => {
    onCreateProject?.();
    setIsOpen(false);
  };

  const displayProject = currentProject || projects[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span>{displayProject?.name || "Select Project"}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px]">
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

        <div className="px-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1.5">
            Projects
          </div>
          {filteredProjects.length > 0 ? (
            <ProjectList
              projects={filteredProjects}
              currentProjectId={currentProject?.id}
              onProjectSelect={handleProjectSelect}
            />
          ) : (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No projects found
            </div>
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleCreateProject}
          className="gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
