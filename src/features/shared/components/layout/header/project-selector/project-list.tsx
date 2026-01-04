import { Check, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "./types";

interface ProjectListProps {
  projects: Project[];
  currentProjectId?: string;
  onProjectSelect: (project: Project) => void;
}

export function ProjectList({
  projects,
  currentProjectId,
  onProjectSelect,
}: ProjectListProps) {
  return (
    <div className="p-1">
      {projects.map((project) => {
        const isSelected = project.id === currentProjectId;
        return (
          <button
            key={project.id}
            onClick={() => onProjectSelect(project)}
            className={cn(
              "w-full flex items-center cursor-pointer rounded-sm gap-3 px-3 py-2 text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isSelected && "bg-accent/50",
            )}
          >
            <FolderOpen className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 text-left">
              <div className="font-medium">{project.name}</div>
              {project.description && (
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {project.description}
                </div>
              )}
            </div>
            {isSelected && <Check className="w-4 h-4 text-primary" />}
          </button>
        );
      })}
    </div>
  );
}
