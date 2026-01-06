export type McpResourceEntry = {
  uri: string;
  name: string;
  title: string;
  description?: string;
  mimeType: string;
};

export type McpResourceContent = {
  uri: string;
  mimeType: string;
  text: string;
};
