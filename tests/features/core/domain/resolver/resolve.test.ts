import {
  resolve,
  ResolveContext,
} from "../../../../../src/features/core/domain/resolver/resolve";
import { ResolveRequest } from "../../../../../src/features/core/domain/types/resolver";

describe("Resolver Determinism (Strict)", () => {
  const request: ResolveRequest = {
    projectId: "p1",
    commandId: "create-component",
    userInput: "Button",
  };

  const context: ResolveContext = {
    project: {
      id: "p1",
      ownerUserId: "u1",
      name: "Project 1",
      slug: "project-1",
      stackPresetId: "nextjs",
      activeRulesetId: "default",
      ruleToggles: {
        "keep-changes-readable": true,
      },
      createdAt: "2024-12-28T00:00:00.000Z",
      updatedAt: "2024-12-28T00:00:00.000Z",
    },
    command: {
      id: "create-component",
      displayName: "Create Component",
      intentId: "generate",
      templateId: "v1",
    },
    ruleset: {
      id: "default",
      name: "Default",
      description: "Default ruleset",
      ruleIds: ["no-new-dependencies"],
      optionalRuleIds: ["keep-changes-readable"],
    },
    stackPreset: {
      id: "nextjs",
      name: "Next.js",
      description: "Next.js stack",
      defaultRulesetId: "default",
      constraints: {
        preferServerComponents: true,
      },
    },
    ruleCatalog: [
      {
        id: "no-new-dependencies",
        title: "No New Dependencies",
        description: "No new dependencies",
        severity: "error",
        appliesToIntents: ["generate"],
        directive: "Do not install new deps.",
        contributesConstraints: { allowNewDeps: false },
      },
      {
        id: "keep-changes-readable",
        title: "Keep Changes Readable",
        description: "Keep changes readable",
        severity: "info",
        appliesToIntents: ["generate"],
        directive: "Keep it simple and readable.",
      },
    ],
  };

  it("should produce byte-equal contract for same input and have no temporal data", () => {
    const result1 = resolve(request, context);
    const result2 = resolve(request, context);

    if (result1.status === "ok" && result2.status === "ok") {
      // Determinism
      expect(result1.contract.contractText).toBe(result2.contract.contractText);
      expect(result1).toEqual(result2);

      // No temporal data (id and generatedAt are now optional and undefined in domain output)
      expect(result1.contract.id).toBeUndefined();
      expect(result1.contract.meta.generatedAt).toBeUndefined();
    } else {
      throw new Error("Resolution failed");
    }
  });

  it("should block if there are conflicting error rules", () => {
    const conflictingContext: ResolveContext = {
      ...context,
      ruleCatalog: [
        ...context.ruleCatalog,
        {
          id: "force-new-dependencies",
          title: "Force New Dependencies",
          description: "Force new dependencies",
          severity: "error",
          appliesToIntents: ["generate"],
          directive: "Always install new deps.",
          conflictsWith: ["no-new-dependencies"],
        },
      ],
      ruleset: {
        ...context.ruleset,
        ruleIds: ["no-new-dependencies", "force-new-dependencies"],
      },
    };

    const result = resolve(request, conflictingContext);
    expect(result.status).toBe("blocked");
    if (result.status === "blocked") {
      expect(result.blocked.reason).toBe("conflicting_rules");
    }
  });

  it("should resolve conflicts deterministically following the matrix", () => {
    const conflictContext: ResolveContext = {
      ...context,
      ruleCatalog: [
        {
          id: "b_rule",
          title: "B",
          description: "B",
          severity: "warn",
          appliesToIntents: ["generate"],
          directive: "Directive B",
          conflictsWith: ["a_rule"],
        },
        {
          id: "a_rule",
          title: "A",
          description: "A",
          severity: "warn",
          appliesToIntents: ["generate"],
          directive: "Directive A",
          conflictsWith: ["b_rule"],
        },
      ],
      ruleset: {
        ...context.ruleset,
        ruleIds: ["a_rule", "b_rule"],
        optionalRuleIds: [],
      },
    };

    const result = resolve(request, conflictContext);
    if (result.status === "ok") {
      // En warn vs warn, debe quedar la de ID menor lexicográficamente: "a_rule"
      expect(result.contract.meta.rulesApplied.length).toBe(1);
      expect(result.contract.meta.rulesApplied[0]?.id).toBe("a_rule");
    }
  });
});
