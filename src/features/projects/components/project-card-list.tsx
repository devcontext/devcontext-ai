"use client";

import Link from "next/link";
import { useApp } from "@/features/shared/providers/app-provider";
import { cn } from "@/features/shared/utils/tailwind-utils";
import type { Project } from "@/features/core/domain/types/projects";
import { appRoutes } from "@/features/routes";
import { Check } from "lucide-react";

interface ProjectCardListProps {
  projects: Project[];
}

export function ProjectCardList({ projects }: ProjectCardListProps) {
  const {
    projects: { activeProject },
  } = useApp();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const isActive = activeProject?.id === project.id;

        return (
          <Link
            key={project.id}
            href={appRoutes.contexts.list.generatePath({
              projectSlug: project.slug,
            })}
            className={cn(
              "group block p-6 bg-card border rounded-xl transition-all shadow-sm hover:shadow-md",
              isActive
                ? "border-primary ring-1 ring-primary/20 bg-primary/[0.02]"
                : "border-border hover:border-primary/50",
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <h3
                className={cn(
                  "text-lg font-semibold transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-card-foreground group-hover:text-primary",
                )}
              >
                {project.name}
              </h3>
              {isActive && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <Check className="w-3 h-3" />
                  Active
                </div>
              )}
            </div>
            <p className="text-[11px] font-mono text-muted-foreground/60 uppercase tracking-tighter">
              /{project.slug}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
