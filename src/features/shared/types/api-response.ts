export type ApiResponse<T = any> = {
  success: boolean;
  error?: string;
  code?: string;
  data?: T;
  fieldErrors?: Partial<Record<string, string>>;
};
