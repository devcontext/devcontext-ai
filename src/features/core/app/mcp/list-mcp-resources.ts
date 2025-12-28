import { contextsRepository } from "../../infra/db/contexts-repository";

export type McpResourceEntry = {
  uri: string;
  name: string;
  title: string;
  description?: string;
  mimeType: string;
};

/**
 * listMcpResources
 *
 * Lists all contexts owned by the specified user, formatted as MCP resources.
 */
export async function listMcpResources(
  userId: string,
): Promise<{ resources: McpResourceEntry[] }> {
  const contexts = await contextsRepository.getContextsByUserId(userId);

  const resources: McpResourceEntry[] = contexts.map((ctx) => ({
    uri: `context://${ctx.id}`,
    name: ctx.name,
    title: ctx.name,
    description:
      ctx.tags.length > 0
        ? `Tags: ${ctx.tags.join(", ")}`
        : `AI Context for ${ctx.name}`,
    mimeType: "text/markdown",
  }));

  return { resources };
}
