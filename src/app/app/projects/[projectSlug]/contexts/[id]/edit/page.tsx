import { notFound } from "next/navigation";
import { getContextAction } from "@/features/contexts/actions/context-actions";
import { ContextEditor } from "@/features/contexts/components/editor/context-editor";

interface EditContextPageProps {
  params: Promise<{ projectSlug: string; id: string }>;
}

export default async function EditContextPage({
  params,
}: EditContextPageProps) {
  const { projectSlug, id } = await params;

  const result = await getContextAction(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const details = result.data;
  const { project, latestVersion } = details;

  return (
    <ContextEditor
      mode="edit"
      projectId={project.id}
      projectSlug={projectSlug}
      projectName={project.name}
      initialData={{
        id: details.id,
        name: details.name,
        tags: details.tags,
        markdown: latestVersion.markdown,
      }}
    />
  );
}
