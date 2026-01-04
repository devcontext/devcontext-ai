import { Context } from "../../../core/domain/types/contexts";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Tag, Clock, Folder } from "lucide-react";

interface ContextCardProps {
  context: Context;
  projectName?: string;
}

export function ContextCard({ context, projectName }: ContextCardProps) {
  const lastUpdated = formatDistanceToNow(new Date(context.updatedAt), {
    addSuffix: true,
  });

  return (
    <Link
      href={`/dashboard/contexts/${context.id}`}
      className="group block p-5 bg-card border border-border rounded-xl hover:border-sidebar-ring transition-all hover:bg-accent/50 hover:shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {context.name}
        </h3>
        {projectName && (
          <div className="flex items-center text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-md border border-border">
            <Folder className="w-3 h-3 mr-1.5" />
            {projectName}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {context.tags.length > 0 ? (
          context.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20"
            >
              <Tag className="w-2.5 h-2.5 mr-1" />
              {tag}
            </span>
          ))
        ) : (
          <span className="text-muted-foreground text-[10px] italic">
            No tags
          </span>
        )}
      </div>

      <div className="flex items-center text-xs text-muted-foreground">
        <Clock className="w-3 h-3 mr-1.5" />
        Updated {lastUpdated}
      </div>
    </Link>
  );
}
