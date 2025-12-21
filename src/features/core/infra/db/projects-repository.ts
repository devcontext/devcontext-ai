import { supabase } from "./supabase-client";
import { Project } from "../../domain/types/projects";

export const projectsRepository = {
  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    // Adapt database record to domain entity if necessary.
    // Assuming DB column names match domain property names for the MVP.
    return data as Project;
  },

  async create(project: Omit<Project, "id">): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();

    if (error || !data) return null;
    return data as Project;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return null;
    return data as Project;
  },
};
