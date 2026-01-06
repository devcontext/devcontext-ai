import { z } from "zod";

export const generateTokenSchema = z.object({
  name: z
    .string()
    .min(1, "Token name is required")
    .max(100, "Token name is too long")
    .trim(),
});

export type GenerateTokenValues = z.infer<typeof generateTokenSchema>;

export const revokeTokenSchema = z.object({
  tokenId: z.string().uuid("Invalid token ID"),
});

export type RevokeTokenValues = z.infer<typeof revokeTokenSchema>;
