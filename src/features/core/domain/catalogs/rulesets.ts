import { RulesetDefinition } from "../types/rulesets";

export const RULESET_CATALOG: RulesetDefinition[] = [
  {
    id: "default-solo-dev",
    name: "Default Solo Dev",
    description: "Ruleset optimizado para desarrolladores independientes con foco en la simplicidad y el control.",
    ruleIds: [
      "no-new-dependencies",
      "prefer-server-components",
      "limit-files-changed",
      "avoid-over-engineering",
      "no-architecture-shifts",
      "ask-before-guessing",
    ],
    optionalRuleIds: [
      "use-existing-ui-components",
      "keep-changes-readable",
    ],
  },
];
