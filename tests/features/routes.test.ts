import { appRoutes } from "@/features/routes";

/**
 * Contract test for the routing system.
 *
 * As per routing-rules.md section 7.1:
 * - Exists a single contract test for routes
 * - Validates each route has path/title/description
 * - Dynamic routes have generatePath
 * - generatePath doesn't return ":" or undefined
 */

// Helper to recursively get all routes from the appRoutes object
interface RouteInfo {
  path: string;
  key: string;
  route: unknown;
}

function getAllRoutes(obj: unknown, prefix = ""): RouteInfo[] {
  const routes: RouteInfo[] = [];

  if (typeof obj !== "object" || obj === null) return routes;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null && "path" in value) {
      routes.push({
        path: (value as { path: string }).path,
        key: prefix ? `${prefix}.${key}` : key,
        route: value,
      });
    }
    // Recurse into nested route objects
    if (typeof value === "object" && value !== null) {
      routes.push(...getAllRoutes(value, prefix ? `${prefix}.${key}` : key));
    }
  }

  return routes;
}

describe("Routing System Contract", () => {
  const allRoutes = getAllRoutes(appRoutes);

  describe("Route Structure Validation", () => {
    it("should have routes defined", () => {
      expect(allRoutes.length).toBeGreaterThan(0);
    });

    it.each(allRoutes.map((r) => [r.key, r]))(
      "route '%s' should have path, title, and description",
      (_key, routeInfo) => {
        const { route } = routeInfo as RouteInfo;
        expect(route).toHaveProperty("path");
        expect(route).toHaveProperty("title");
        expect(route).toHaveProperty("description");

        const typedRoute = route as {
          path: string;
          title: string;
          description: string;
        };
        expect(typeof typedRoute.path).toBe("string");
        expect(typeof typedRoute.title).toBe("string");
        expect(typeof typedRoute.description).toBe("string");
      },
    );

    it.each(allRoutes.map((r) => [r.key, r]))(
      "route '%s' path should start with / and not end with /",
      (_key, routeInfo) => {
        const { route } = routeInfo as RouteInfo;
        const typedRoute = route as { path: string };

        expect(typedRoute.path.startsWith("/")).toBe(true);
        if (typedRoute.path.length > 1) {
          expect(typedRoute.path.endsWith("/")).toBe(false);
        }
      },
    );
  });

  describe("Dynamic Routes Validation", () => {
    const dynamicRoutes = allRoutes.filter((r) => {
      const route = r.route as { path: string };
      return route.path.includes(":");
    });

    it.each(dynamicRoutes.map((r) => [r.key, r]))(
      "dynamic route '%s' should have generatePath function",
      (_key, routeInfo) => {
        const { route } = routeInfo as RouteInfo;
        expect(route).toHaveProperty("generatePath");
        expect(typeof (route as { generatePath: unknown }).generatePath).toBe(
          "function",
        );
      },
    );

    it("contexts.list.generatePath should not return : or undefined", () => {
      const result = appRoutes.contexts.list.generatePath({
        projectSlug: "test-project",
      });
      expect(result).not.toContain(":");
      expect(result).not.toContain("undefined");
      expect(result).toBe("/app/projects/test-project/contexts");
    });

    it("contexts.detail.generatePath should not return : or undefined", () => {
      const result = appRoutes.contexts.detail.generatePath({
        projectSlug: "test-project",
        id: "ctx-123",
      });
      expect(result).not.toContain(":");
      expect(result).not.toContain("undefined");
      expect(result).toBe("/app/projects/test-project/contexts/ctx-123");
    });

    it("contexts.composer.generatePath should not return : or undefined", () => {
      const result = appRoutes.contexts.composer.generatePath({
        projectSlug: "test-project",
      });
      expect(result).not.toContain(":");
      expect(result).not.toContain("undefined");
      expect(result).toBe("/app/projects/test-project/composer");
    });

    it("projects.detail.generatePath should not return : or undefined", () => {
      const result = appRoutes.projects.detail.generatePath({
        projectSlug: "my-project",
      });
      expect(result).not.toContain(":");
      expect(result).not.toContain("undefined");
      expect(result).toBe("/app/projects/my-project");
    });
  });

  describe("Static Routes", () => {
    it("appRoutes.home should have correct path", () => {
      expect(appRoutes.home.path).toBe("/app");
    });

    it("appRoutes.auth.login should have correct path", () => {
      expect(appRoutes.auth.login.path).toBe("/login");
    });

    it("appRoutes.auth.signup should have correct path", () => {
      expect(appRoutes.auth.signup.path).toBe("/signup");
    });

    it("appRoutes.settings.root should have correct path", () => {
      expect(appRoutes.settings.root.path).toBe("/app/settings");
    });

    it("appRoutes.settings.accessTokens should have correct path", () => {
      expect(appRoutes.settings.accessTokens.path).toBe(
        "/app/settings/access-tokens",
      );
    });

    it("appRoutes.projects.list should have correct path", () => {
      expect(appRoutes.projects.list.path).toBe("/app/projects");
    });
  });
});
