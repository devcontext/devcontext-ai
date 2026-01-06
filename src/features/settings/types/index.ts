export interface ApiKeyItemProps {
  id: string;
  name: string;
  createdAt: Date;
  lastUsedAt: Date | null;
  onRevoke: (id: string) => void;
}

export interface GenerateKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (
    name: string,
  ) => Promise<{ success: boolean; apiKey?: string; error?: string }>;
}

export interface McpConfigSnippetProps {
  apiKey: string;
  projectUrl: string;
}
