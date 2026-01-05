import { notFound } from "next/navigation";
import { getContextAction } from "@/features/contexts/actions/context-actions";
import { ContextDetailContainer } from "@/features/contexts/components/viewer/context-detail-container";
import { ContentContainer } from "@/features/shared/components/layout/content-container";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { appRoutes } from "@/features/routes";

interface ContextDetailPageProps {
  params: Promise<{ projectSlug: string; id: string }>;
}

export default async function ContextDetailPage({
  params,
}: ContextDetailPageProps) {
  const { projectSlug, id } = await params;

  // Use the server action which includes the project in ContextDetails
  const result = await getContextAction(id);

  // Unified validation: if not success or no data, it's a 404/Forbidden
  if (!result.success || !result.data) {
    notFound();
  }

  const details = result.data;
  const { project } = details;

  return (
    <ContentContainer>
      {/* Custom Header with Back Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href={appRoutes.contexts.list.generatePath({ projectSlug })}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-border mx-2" />
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 border border-primary/20 rounded">
                {project.name}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {details.name}
            </h1>
          </div>
        </div>

        <Link
          href={appRoutes.contexts.edit.generatePath({ projectSlug, id })}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 border border-border rounded-lg transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Edit Context
        </Link>
      </div>

      {/* Detailed Container (Client Component) */}
      <ContextDetailContainer details={details} projectSlug={projectSlug} />
    </ContentContainer>
  );
}
