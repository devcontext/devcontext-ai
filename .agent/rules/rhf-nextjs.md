---
trigger: always_on
---

# 🧠 RULESET EJECUTABLE — Formularios

## React Hook Form + Next.js (App Router) + Zod

**Audiencia:** Agentes de IA y developers senior
**Objetivo:** Código predecible, UX clara, cero improvisación

---

## ÍNDICE CANÓNICO (usa estos números)

> **Estos son los únicos IDs que el agente puede citar.**

1. Zod-first: contrato único (cliente + servidor)
2. Server revalida con `safeParse` antes de persistir
3. Submit con RHF → Server Action (no `action={}` si hay UX rica)
4. Contrato de respuesta: reutilizar el existente del proyecto; si no existe, definir uno mínimo y único
5. Aplicación de errores: usar util `applyActionErrors` (no loops inline)
6. Feedback UX: loading/disabled + error/success global consistente
7. A11y: `label` + `aria-invalid` + `aria-describedby` + no solo color
8. `mode: onTouched`, `defaultValues`, async → `reset`, condicionales → `shouldUnregister`
9. Performance: `register` por defecto, `Controller` solo si hace falta, no abusar de `watch`
10. Componentización: `FormField` + `FieldWrapper` obligatorios, sin markup repetido
11. Imports anti-escape: forms no importan primitives UI ni `FormProvider`
12. FormWrapper: Provider + `<form>` + feedback global centralizado
13. Tipado: no amputar props nativas (usar `ComponentPropsWithoutRef` + `Omit`)
14. Transformación: input string → dominio explícito (preferir `z.coerce.*` si aplica)
15. Toasts: estándar del proyecto (shadcn/ui – Sonner), solo eventos globales
16. Server Actions: compatibilidad con contrato existente antes de crear uno nuevo

---

## PRINCIPIO BASE

> **Zod es la única fuente de verdad.**
> Si una regla no está en Zod, no existe.

---

## 1. CONTRATO DE DATOS (OBLIGATORIO)

1. Toda validación vive en `schema.ts` usando Zod.
2. Prohibido definir validaciones en JSX (`required`, `validate`, etc.).
3. Tipos inferidos desde Zod:

   ```ts
   type FormData = z.infer<typeof schema>;
   ```

4. El mismo schema se reutiliza en:
   - Cliente (RHF)
   - Server Actions / API
   - Persistencia

---

## 2. VALIDACIÓN Y SEGURIDAD

5. La validación en cliente es solo UX.
6. El servidor **SIEMPRE** revalida con `safeParse()`.
7. Nunca persistir datos sin validar.

---

## 3. SUBMIT & SERVER ACTIONS

8. RHF controla el submit y la UX.
9. Server Actions gestionan lógica de negocio y persistencia.
10. No usar `action={}` si se necesita feedback inmediato.
11. El submit siempre sigue este patrón:

```ts
const onSubmit = async (data) => {
  const result = await action(data);
};
```

12. La extracción y aplicación de errores del servidor **no se implementa manualmente en cada formulario**.

- Debe usarse una utilidad compartida (ver sección 4/Utils).

---

## 4. CONTRATO DE RESPUESTA DEL SERVIDOR

13. Las Server Actions **NO lanzan errores de negocio**.
14. Siempre devuelven una estructura consistente (tipada):

```ts
export type ActionResult<TField extends string = string> =
  | { ok: true; message?: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<TField, string>> };
```

15. Los formularios deben tratar `fieldErrors` como errores de campo y `error` como error global.

---

## 5. MANEJO DE ERRORES

16. Errores de campo → `setError(field)`.
17. Errores globales → `setError("root")`.
18. Si hay `fieldErrors`, **aplicarlos con la utilidad compartida** (no loops inline).
19. Nunca usar solo toast para errores de campo.

---

## 6. FEEDBACK UX (CICLO DE VIDA)

18. Al enviar:
    - Botón en loading (`isSubmitting`)
    - Botón deshabilitado
    - Prevenir doble submit

19. En error:
    - Feedback visible según estándar del proyecto (toast / banner)
    - Mantener errores de campo visibles

20. En éxito:
    - Ejecutar acción definida (redirect, close, invalidate, etc.)
    - Mostrar success solo si aporta valor
    - `reset()` solo si el flujo lo requiere

---

## 7. CONFIGURACIÓN DE RHF

21. `mode: "onTouched"`.
22. `defaultValues` obligatorios.
23. Datos async → `reset(data)`.
24. Campos condicionales → `shouldUnregister: true`.
25. La estructura repetida:

```tsx
<FormProvider {...methods}>
  <form onSubmit={handleSubmit(onSubmit)}>
```

**no se escribe en cada formulario**.

- Debe usarse el componente compartido `FormWrapper`.

---

## 8. CONTROL VS NO CONTROL

25. Inputs HTML nativos → `register`.
26. Componentes sin `ref` (shadcn, Radix, custom) → `<Controller />`.
27. Prohibido usar `Controller` por costumbre.

---

## 9. PERFORMANCE

28. No usar `watch()` global.
29. Usar `useWatch` con campos específicos.
30. Evitar estado duplicado (UI state ≠ form state).

---

## 10. ACCESIBILIDAD (NO OPCIONAL)

31. `label` asociado a cada input.
32. `aria-invalid` dinámico.
33. `aria-describedby` apuntando al error.
34. Error no puede indicarse solo por color.
35. Focus automático al primer error.

---

## 11. COMPONENTIZACIÓN (ENFORCED)

36. **Prohibido** escribir campos “a mano” con `Label + Input + Error` dentro de formularios.
37. Debe existir un **único punto de entrada** para campos:

- `src/features/shared/components/form/form-field/FormField`.

38. Debe existir un wrapper común llamado **`FieldWrapper`** que encapsule todo lo repetido:

- layout (label/description/error)
- ids (`fieldId`, `errorId`, `descId`)
- accesibilidad (`aria-invalid`, `aria-describedby`)
- integración con RHF (`useFormContext`, `errors`, `isSubmitting`)

39. **Prohibido** duplicar en `fields/*` el markup de `Label + description + error + aria glue`.

- Eso vive en `FieldWrapper`.
- Cada `fields/*Field.tsx` solo renderiza el _control_ (Input/Select/etc.) usando el wrapper.

### ✅ Reglas de tipado (IMPORTANTE)

40. Los tipos **deben vivir en `types.ts`** por legibilidad.

- Este `types.ts` es **local al módulo** (p. ej. `form-field/types.ts`, `form-wrapper/types.ts`).
- **Prohibido** crear un `types.ts` gigante global para toda la app.
- Si necesitas contratos transversales (ej. respuestas de acciones), van en `form/utils/types.ts` (único lugar).

41. Los props **no pueden limitar** las capacidades de un input nativo.

- `TextField`/`PasswordField` aceptan `React.ComponentPropsWithoutRef<"input">` (con `Omit` de props controladas).
- `TextareaField` acepta `React.ComponentPropsWithoutRef<"textarea">`.
- `FormField` debe pasar `...rest` al componente concreto, y este al control.

### ✅ Dispatcher (sin switch, fallback seguro)

42. `FormField` hace `if` por tipos especiales y fallback a `TextField`.
43. `FormField` **nunca** devuelve `null`.

### ✅ Criterios de aceptación (componentización)

44. Si en un PR aparece repetido `Label + Input + error <p>` dentro de un formulario:

- Incumple el ruleset.
- Refactor obligatorio a `FormField`.

45. Si se añade un nuevo tipo:

- Crear `fields/*Field.tsx`
- Añadir typing en `types.ts`
- Registrar en `FormField` (ifs + fallback)

---

## 12. TRANSFORMACIÓN DE DATOS

46. El input siempre empieza como string (HTML). El dominio no.
47. Transformar explícitamente a dominio (number, boolean, etc.).
48. Preferir que la conversión viva en Zod cuando aplique (sigue siendo Zod-first).

### ✅ Ejemplo (coerce)

```ts
const schema = z.object({
  age: z.coerce.number().int().min(18),
});
```

49. No confiar en transformaciones implícitas ni en “magia” del UI.

---

## 13. FORM WRAPPER (ENFORCED)

49. Debe existir `FormWrapper` como componente compartido para:

- `FormProvider`
- `<form onSubmit={handleSubmit(...)}>`
- spacing/clases base
- gestión consistente del estado de submit

50. `FormWrapper` debe gestionar también el **feedback global** del formulario.

- Los formularios **no** renderizan banners inline tipo `globalError && <div ...>`.
- En su lugar, pasan mensajes al wrapper por props.

### ✅ API recomendada (tipada)

- `FormWrapper<T>` recibe:
  - `methods: UseFormReturn<T>`
  - `onSubmit: (data: T) => Promise<void> | void`
  - `children: ReactNode`
  - `className?: string`
  - `globalError?: string | null`
  - `successMessage?: string | null`

**Regla:** los formularios no pueden repetir `FormProvider + form` inline.

51. **Regla de imports (anti-escape):**

- En componentes de formulario (`*form.tsx`) está **prohibido** importar:
  - `FormProvider`
  - `Input`, `Label`, `Textarea`, `Select` (UI primitives)

- Solo se permite importar:
  - `FormWrapper` desde `src/features/shared/components/form/form-wrapper`
  - `FormField` desde `src/features/shared/components/form/form-field`
  - utilidades de `src/features/shared/components/form/utils`

---

## 14. UTILS (ENFORCED)

52. Debe existir una utilidad compartida para aplicar `fieldErrors`:

- `applyActionErrors({ setError, fieldErrors })`

### ✅ Reglas

53. Prohibido repetir `Object.entries(fieldErrors).forEach(...)` en formularios.
54. Debe estar tipado para que `field` sea `Path<T>` (o equivalente) y no `string` suelto.
55. Debe mapear a `setError(field, { type: "manual", message })`.

---

## 15. TOASTS (ESTÁNDAR DEL PROYECTO)

56. El proyecto usa los toasts de shadcn/ui (Sonner).
57. Los formularios **no** implementan una librería alternativa.
58. Reglas de uso:

- Toast **solo** para eventos globales (submit success/fail).
- Errores de campo se muestran en el campo (no toast por campo).

---

## 16. RESPUESTA DE SERVER ACTIONS (COMPATIBILIDAD)

59. Antes de crear tipos nuevos (`ActionResult`, etc.), el agente debe:

- Buscar si ya existe un contrato global de respuestas de acciones en el proyecto.
- Reutilizarlo si existe.

60. Si no existe, puede proponer uno **mínimo** (pero no inventar múltiples variantes).

- Debe vivir en un único lugar compartido.

---

## REGLA FINAL

> Las reglas numeradas dentro de este documento (40–60, etc.) son **numeración interna/legacy**.
> Para citar reglas en PRs, revisiones o prompts del agente, usa **solo** el **ÍNDICE CANÓNICO (1–14)** del inicio.

Criterio de terminado:

- No valida en servidor
- No da feedback claro
- No es accesible
- No escala sin refactor

> **Que funcione no es suficiente. Debe ser confiable.**
