import { type SupabaseClient } from "@supabase/supabase-js";
import { ContextsRepository } from "../../core/infra/db/contexts-repository";
import { NotFoundError } from "../../core/domain/errors";
import { McpResourceEntry, McpResourceContent } from "../types";

/**
 * McpService
 *
 * Orquestra la lógica de MCP siguiendo el patrón Action -> Service -> Repo.
 * Reemplaza las funciones sueltas en core/app/mcp por un servicio centralizado.
 */
export class McpService {
  private repository: ContextsRepository;

  constructor(supabase: SupabaseClient) {
    this.repository = new ContextsRepository(supabase);
  }

  /**
   * Lista los contextos de un usuario como recursos MCP.
   */
  async listResources(userId: string): Promise<McpResourceEntry[]> {
    try {
      const contexts = await this.repository.searchContexts({ userId });

      return contexts.map((ctx) => ({
        uri: `context://${ctx.id}`,
        name: ctx.name,
        title: ctx.name,
        description:
          ctx.tags.length > 0
            ? `Tags: ${ctx.tags.join(", ")}`
            : `AI Context for ${ctx.name}`,
        mimeType: "text/markdown",
      }));
    } catch (error) {
      console.error("[McpService] Error listing resources:", error);
      throw error;
    }
  }

  /**
   * Lee el contenido markdown de la última versión de un recurso MCP.
   * Valida propiedad del recurso.
   */
  async readResource(
    userId: string,
    resourceUri: string,
  ): Promise<McpResourceContent[]> {
    const contextId = resourceUri.replace("context://", "").split("?")[0];

    if (!contextId) {
      throw new Error("Invalid resource URI");
    }

    // Validar propiedad: listamos contextos del usuario y buscamos el ID
    const contexts = await this.repository.searchContexts({ userId });
    const context = contexts.find((ctx) => ctx.id === contextId);

    if (!context) {
      throw new NotFoundError(
        `Context with ID ${contextId} not found or unauthorized`,
      );
    }

    const latestVersion = await this.repository.getLatestVersion(contextId);
    if (!latestVersion) {
      throw new NotFoundError(`No versions found for context ${contextId}`);
    }

    return [
      {
        uri: resourceUri,
        mimeType: "text/markdown",
        text: latestVersion.markdown,
      },
    ];
  }
}
