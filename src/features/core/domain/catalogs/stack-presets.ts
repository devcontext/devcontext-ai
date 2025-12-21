import { StackPresetDefinition } from "../types/stack-presets";

export const STACK_PRESET_CATALOG: StackPresetDefinition[] = [
  {
    id: "nextjs-app-router",
    name: "Next.js (App Router)",
    description: "Configuración estándar para proyectos modernos de Next.js usando App Router y Typescript.",
    defaultRulesetId: "default-solo-dev",
    constraints: {
      preferServerComponents: true,
      allowNewDependencies: false,
    },
  },
  {
    id: "vite-react-spa",
    name: "Vite + React (SPA)",
    description: "Configuración para aplicaciones de una sola página (SPA) con React y Vite.",
    defaultRulesetId: "default-solo-dev",
    constraints: {
      allowNewDependencies: false,
    },
  },
];
