export const CONTRACT_TEMPLATE_V1 = `You are executing: {INTENT_HUMAN}

NON‑NEGOTIABLE RULES:
{RULES_BULLETS}

CONSTRAINTS:
{CONSTRAINTS_BULLETS}

PROJECT STACK:
{STACK_BULLETS}

STOP CONDITIONS:
- If any rule must be violated, STOP and ask for explicit permission.
- If required information is missing, ask instead of guessing.

OUTPUT REQUIREMENTS:
- Keep the solution simple and aligned with the stack.
- Provide a short file-level plan before code when generating changes.`;
