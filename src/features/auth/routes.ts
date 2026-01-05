import { BaseRoute } from "@/features/shared/types/routes";

/**
 * Authentication routes
 */
export const authRoutes = {
  login: {
    path: "/login",
    title: "Login",
    description: "Sign in to your account",
  } satisfies BaseRoute,

  signup: {
    path: "/signup",
    title: "Sign Up",
    description: "Create a new account",
  } satisfies BaseRoute,
} as const;
