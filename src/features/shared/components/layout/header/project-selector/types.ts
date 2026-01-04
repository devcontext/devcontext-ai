export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface ProjectSelectorProps {
  currentProject?: Project;
  projects?: Project[];
  onProjectChange?: (project: Project) => void;
  onCreateProject?: () => void;
}
