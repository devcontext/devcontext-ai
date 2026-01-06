import { ContextEditor } from "@/features/contexts/components/editor/context-editor";
import { getProjectBySlug } from "@/features/projects/services/get-project-by-slug";

interface ComposerPageProps {
  params: Promise<{ projectSlug: string }>;
}

export default async function ComposerPage({ params }: ComposerPageProps) {
  const { projectSlug } = await params;
  const project = await getProjectBySlug(projectSlug);

  return (
    <ContextEditor
      mode="create"
      projectId={project.id}
      projectSlug={projectSlug}
      projectName={project.name}
    />
  );
}
