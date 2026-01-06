"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/features/shared/ui/button";
import { FormWrapper, FormField } from "@/features/shared/components/form";
import {
  createProjectSchema,
  type CreateProjectInput,
} from "@/features/projects/schemas";
import { useCreateProject } from "../hooks/use-create-project";
import { useApp } from "@/features/shared/providers/app-provider";
import type { Project } from "@/features/core/domain/types/projects";

interface CreateProjectFormProps {
  onSuccess?: (project: Project) => void;
  onCancel?: () => void;
}

export function CreateProjectForm({
  onSuccess,
  onCancel,
}: CreateProjectFormProps) {
  const { createProject, loading } = useCreateProject();
  const {
    projects: { addProject },
  } = useApp();

  const methods = useForm<CreateProjectInput>({
    mode: "onSubmit",
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      stackPresetId: null,
      activeRulesetId: null,
      ruleToggles: {},
    },
  });

  const {
    formState: { errors },
    setError,
  } = methods;

  const onSubmit = async (data: CreateProjectInput) => {
    const project = await createProject(data);

    if (project) {
      addProject(project);
      onSuccess?.(project);
    } else {
      setError("root", {
        message: "Failed to create project. Please try again.",
      });
    }
  };

  return (
    <FormWrapper
      methods={methods}
      onSubmit={onSubmit}
      globalError={errors.root?.message}
    >
      <FormField<CreateProjectInput>
        name="name"
        label="Project Name"
        description="Choose a descriptive name for your project."
        placeholder="My Awesome Project"
        required
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Project
        </Button>
      </div>
    </FormWrapper>
  );
}
