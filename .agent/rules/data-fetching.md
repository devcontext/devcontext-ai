---
trigger: always_on
---

# 🧠 RULESET EJECUTABLE — Data Fetching

## Next.js App Router (Server-First)

**Audiencia:** Agentes de IA y developers senior
**Objetivo:** Carga de datos predecible, eficiente y alineada con App Router. Cero fetch innecesario en cliente.

---

## ÍNDICE CANÓNICO (usa estos números)

> **Estos son los únicos IDs que el agente puede citar.**

1. Server-first: cargar datos en Server Components siempre que sea posible
2. Client fetch solo cuando el server no puede
3. Boundary correcto: pages/layouts llaman actions/services, no repos
4. Composición por props: el server prepara datos, la UI renderiza
5. Paralelización obligatoria para entidades independientes
6. Prohibido waterfalls por awaits secuenciales
7. Manejo de errores consistente y centralizado
8. Cache/revalidate explícito si aplica

---

## PRINCIPIO BASE

> **El servidor es la fuente principal de datos.**
> El cliente solo interactúa cuando el server no puede hacerlo correctamente.

---

## 1. SERVER-FIRST (OBLIGATORIO)

1. Todas las rutas bajo `app/` son Server Components por defecto.
2. Los datos deben cargarse en el servidor siempre que no dependan de interacción directa del usuario o APIs del navegador.
3. El resultado de la carga se pasa al componente de UI vía props.

---

## 2. CLIENT FETCH (EXCEPCIONES)

4. El fetch en cliente solo está permitido si depende de interacción del usuario (filtros, search live), es real-time o usa APIs del navegador.
5. Si se usa cliente, debe documentarse el motivo en el componente.

---

## 3. CONTEXTO DE DATOS (SUPABASE CLIENT)

6. **El cliente de Supabase se crea una vez por request** usando el helper `withAppContext`.
7. **Inyección de Dependencias:** Los repositorios reciben el cliente por constructor, NUNCA lo instancian internamente.
8. El repositorio se instancia dentro del servicio usando el cliente provisto por el contexto.

---

## 4. CAPAS (ACTION → SERVICE → REPO)

9. **Actions (Server Actions):**
   - Adaptador entre UI y Negocio.
   - **Validación:** TODO input debe validarse con Zod (incluyendo IDs) usando los schemas en `features/<feature>/schemas.ts`.
   - **Errores:** Retorna siempre `ApiResponse<T>` usando los helpers `successResponse`, `errorResponse` (para validación) y `handleErrorResponse` (para el catch block).
   - `try/catch` obligatorio.

10. **Services:**
    - Viven en `src/features/<feature>/services/`.
    - Orquestan la lógica de negocio usando `withAppContext`.
    - Orquestan repositorios y validaciones cruzadas.

11. **Repos (infra):**
    - Acceso a datos puro.
    - Lanzan **errores controlados** (`NotFoundError`, `UnexpectedError`) usando bloques `try-catch`.

---

## 5. ERRORES CONTROLADOS (DOMAIN)

12. Todos los errores de dominio heredan de `DomainError` en `src/features/core/domain/errors.ts`.
13. Repositorios lanzan: `NotFoundError`, `ConflictError`, `UnexpectedError`.
14. Servicios lanzan: `ForbiddenError` (si falla la propiedad), `UnauthorizedError`.
15. Se deben usar type guards como `isDomainError` para un manejo seguro en el error handler global.

---

## 6. ORGANIZACIÓN DE ARCHIVOS

16. **Schemas:** Viven en `src/features/<feature>/schemas.ts`.
17. **Servicios:** Viven en `src/features/<feature>/services/`.
18. **Acciones:** Viven en `src/features/<feature>/actions/`.

---

## 7. PARALELIZACIÓN Y PERFORMANCE

19. Si se requieren múltiples entidades independientes, las llamadas deben ejecutarse en paralelo (`Promise.all`).
20. Evitar waterfalls innecesarios detectando dependencias reales entre datos.

---

## ANTI-PATTERNS (PROHIBIDOS)

- Fetch en cliente sin `// JUSTIFICACIÓN`.
- Repo importado directamente en page/layout o componente.
- Usar `createSupabaseServerClient()` fuera de `AppContext`.
- Retornar `null` en lugar de lanzar una excepción controlada cuando algo no se encuentra.
- No validar IDs con Zod en las acciones.
- Repetir markup de error en acciones en lugar de usar `handleErrorResponse`.

---

## REGLA FINAL

> **Action → Service → Repo**.
> El flujo de datos es unidireccional, tipado con `ApiResponse` y guardado por `DomainError`. Sin excepciones.