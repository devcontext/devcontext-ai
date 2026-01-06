import { Check, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/features/core/domain/types/projects";

interface ProjectListProps {
  projects: Project[];
  currentProjectId?: string | null;
  onProjectSelect: (project: Project) => void;
}

export function ProjectList({
  projects,
  currentProjectId,
  onProjectSelect,
}: ProjectListProps) {
  return (
    <div className="py-1">
      {projects.map((project) => {
        const isSelected = project.id === currentProjectId;
        return (
          <button
            key={project.id}
            onClick={() => onProjectSelect(project)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isSelected && "bg-accent/50",
            )}
          >
            <FolderOpen className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 text-left">
              <div className="font-medium">{project.name}</div>
            </div>
            {isSelected && <Check className="w-4 h-4 text-primary" />}
          </button>
        );
      })}
    </div>
  );
}
