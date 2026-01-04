---
trigger: always_on
---

---

## trigger: always_on

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
2. Los datos deben cargarse en el servidor siempre que:
   - no dependan de interacción directa del usuario
   - no requieran APIs exclusivas del navegador

3. El resultado de la carga se pasa al componente de UI vía props.

**Anti-pattern:**

- `useEffect + fetch` en componentes que podrían ser server.

---

## 2. CLIENT FETCH (EXCEPCIONES JUSTIFICADAS)

4. El fetch en cliente solo está permitido si:
   - depende de interacción del usuario (filtros, search live)
   - es real-time
   - usa APIs del navegador

5. Si se usa cliente, debe documentarse el motivo en el componente.

---

## 3. CONTEXTO DE DATOS (SUPABASE CLIENT)

6. **El cliente de Supabase NO se crea en cada método del repositorio.**
7. El cliente se crea **una vez por request** dentro de un contexto server-side.
8. Punto recomendado de creación:
   - `withUserContext()` (o equivalente) crea `supabase` + resuelve `userId`.

9. El `service` recibe `{ userId, supabase }` (o `db`) desde el contexto.
10. El repositorio recibe el client por parámetro/constructor (por request), **nunca lo construye**.

**Anti-patterns:**

- `createServerClient()` dentro de cada método del repo
- pasar `userId` desde el cliente como input confiable

---

## 4. CAPAS (ACTION → SERVICE → REPO)

11. **Actions (Server Actions):** adaptador.

- `try/catch` obligatorio.
- retorna `ApiResponse<T>` usando helpers (`successApiResponse`, `handleApiResponseError`).

12. **Services:** orquestan.

- validan autenticación/permisos vía `withUserContext`.
- NO formatean respuestas.
- NO hacen `try/catch` salvo que rewrapeen errores a errores controlados.

13. **Repos (infra):** acceso a datos.

- hablan con Supabase/DB.
- lanzan **errores controlados** (DomainError) o wrappean errores externos.

---

## 5. ERRORES CONTROLADOS (DOMAIN)

14. Debe existir un set de errores de dominio (ej. `DomainError`) con:

- `code` (estable)
- `message`
- `field?`
- `context?`

15. Repositorios lanzan:

- `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`, `ValidationError`, `UnexpectedError`.

16. Actions convierten errores a `ApiResponse` de forma consistente mediante el handler global.

**Regla:** los componentes de UI no interpretan errores crudos de infra.

---

## 6. BOUNDARY CORRECTO

17. `page.tsx` y `layout.tsx` pueden:

- llamar a **actions** o **services**

18. Está prohibido:

- importar repositorios directamente
- acceder a DB o SDKs de infra

---

## 7. COMPOSICIÓN POR PROPS

19. La page prepara el "view model" necesario para renderizar.
20. Los componentes de UI:

- no deciden cómo se cargan los datos
- no ejecutan lógica de fetch primaria

---

## 8. PARALELIZACIÓN (ENFORCED)

21. Si se requieren múltiples entidades independientes:
    - las llamadas deben ejecutarse en paralelo (`Promise.all` o promesas adelantadas)

22. Prohibido encadenar awaits sin dependencia real.

---

## 9. EVITAR WATERFALLS

23. No hacer:

```ts
await a();
await b();
await c();
```

Si `a`, `b`, `c` son independientes.

24. El agente debe detectar y refactorizar waterfalls automáticamente.

---

## 10. MANEJO DE ERRORES

25. Las pages no implementan manejo de errores ad-hoc.
26. Los errores deben:

- mapearse a `ApiResponse` (actions) o
- ser gestionados por `error.tsx` / boundary global

---

## 11. CACHE Y REVALIDACIÓN (SI APLICA)

27. Si se usa cache/revalidate:

- debe declararse explícitamente
- nunca confiar en defaults implícitos

28. Cada query define su política (o ninguna).

---

## ANTI-PATTERNS (PROHIBIDOS)

- Fetch en cliente por costumbre
- Repo importado en page/layout
- Cliente Supabase creado por método de repo
- Waterfalls de awaits
- UI decidiendo data access
- Manejo de errores por pantalla

---

## REGLA FINAL

> Si un dato puede cargarse en servidor, **debe cargarse en servidor**.
> El cliente es una excepción, no la norma.

> El acceso a datos es: **Action → Service → Repo**, con errores controlados y respuesta consistente.

## 4. COMPOSICIÓN POR PROPS

8. La page prepara el "view model" necesario para renderizar.
9. Los componentes de UI:
   - no deciden cómo se cargan los datos
   - no ejecutan lógica de fetch primaria

---

## 5. PARALELIZACIÓN (ENFORCED)

10. Si se requieren múltiples entidades independientes:
    - las llamadas deben ejecutarse en paralelo (`Promise.all` o promesas adelantadas)

11. Prohibido encadenar awaits sin dependencia real.

---

## 6. EVITAR WATERFALLS

12. No hacer:

```ts
await a();
await b();
await c();
```

Si `a`, `b`, `c` son independientes.

13. El agente debe detectar y refactorizar waterfalls automáticamente.

---

## 7. MANEJO DE ERRORES

14. Las pages no implementan manejo de errores ad-hoc.
15. Los errores deben:

- mapearse a `ApiResponse` o
- ser gestionados por `error.tsx` / boundary global

---

## 8. CACHE Y REVALIDACIÓN (SI APLICA)

16. Si se usa cache/revalidate:

- debe declararse explícitamente
- nunca confiar en defaults implícitos

17. Cada query define su política (o ninguna).

---

## ANTI-PATTERNS (PROHIBIDOS)

- Fetch en cliente por costumbre
- Repo importado en page/layout
- Waterfalls de awaits
- UI decidiendo data access
- Manejo de errores por pantalla

---

## REGLA FINAL

> Si un dato puede cargarse en servidor, **debe cargarse en servidor**.
> El cliente es una excepción, no la norma.
