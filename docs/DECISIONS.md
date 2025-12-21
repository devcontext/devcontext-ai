# DECISIONS.md

Este documento registra **decisiones conscientes** tomadas durante el diseño del MVP.

Su objetivo es evitar re‑discusiones, dudas cíclicas y re‑trabajo.
Si una decisión está aquí, **no se vuelve a debatir** salvo evidencia fuerte.

---

## D‑001 — Solo Dev First

**Decision**
El MVP está diseñado exclusivamente para *solo developers*.

**Why**

* Permite validar el core sin complejidad organizativa
* Evita permisos, roles y gobernanza temprana
* Reduce el scope a lo esencial: comportamiento de la IA

**Trade‑offs**

* No colaboración
* No sharing

**Revisit when**

* El creador lo use diariamente
* Existan señales claras de uso repetido

---

## D‑002 — No Prompt Editing

**Decision**
El usuario **no puede editar prompts** ni el contrato.

**Why**

* Prompt editing rompe la predictibilidad
* Devuelve la carga cognitiva al usuario
* Convierte el producto en un prompt manager

**Trade‑offs**

* Menos flexibilidad
* Usuarios avanzados pueden frustrarse

**Revisit when**

* El modelo mental esté validado

---

## D‑003 — Commands over Configuration

**Decision**
La interacción principal se hace mediante **comandos**, no mediante configuración avanzada.

**Why**

* Se alinea con el uso real en Cursor/CLI
* Reduce fricción
* Evita UIs de configuración complejas

**Trade‑offs**

* Menos control granular inicial

**Revisit when**

* Los comandos se conviertan en workflows

---

## D‑004 — Rules as System Knowledge

**Decision**
Las reglas son **conocimiento del sistema**, no del usuario.

**Why**

* Los usuarios no quieren diseñar reglas coherentes
* Previene reglas contradictorias o inútiles
* Mantiene consistencia entre proyectos

**Trade‑offs**

* No custom rules en MVP

**Revisit when**

* El catálogo esté maduro
* El core esté validado

---

## D‑005 — Catalogs as Code

**Decision**
Rules, commands, presets y rulesets viven como **código/config**, no como datos editables.

**Why**

* Control total y determinismo
* Sin migraciones
* Fácil versionado

**Trade‑offs**

* Menos dinamismo

**Revisit when**

* Exista necesidad real de edición en runtime

---

## D‑006 — Resolver is Pure and Deterministic

**Decision**
El Resolver es una función pura sin IA ni estado.

**Why**

* Predecible
* Testable
* Escalable sin re‑arquitectura

**Trade‑offs**

* No "inteligencia" adaptativa

**Revisit when**

* Existan casos claros que requieran planificación avanzada

---

## D‑007 — MCP as Adapter, Not Core

**Decision**
El MCP es un **adaptador de ejecución**, nunca el núcleo del sistema.

**Why**

* Evita lock‑in
* Permite CLI, API o extensiones

**Trade‑offs**

* MCP no ejecuta modelos en MVP

**Revisit when**

* Se requiera ejecución server‑side del LLM

---

## D‑008 — Minimal Logging, No Analytics

**Decision**
Solo se guardan logs estructurados mínimos.

**Why**

* Respeta privacidad
* Reduce complejidad
* Suficiente para debugging

**Trade‑offs**

* No métricas de uso avanzadas

**Revisit when**

* El MVP esté validado

---

## D‑009 — Predictability over Flexibility

**Decision**
La predictibilidad es más importante que la flexibilidad.

**Why**

* El dolor real es la imprevisibilidad de la IA
* La flexibilidad sin límites destruye confianza

**Trade‑offs**

* Menos opciones

**Revisit when**

* El sistema sea confiable por defecto

---

## D‑010 — Stop Is a Valid Outcome

**Decision**
Bloquear una ejecución es mejor que generar algo incorrecto.

**Why**

* Fomenta confianza
* Evita daño silencioso

**Trade‑offs**

* Más fricción puntual

**Revisit when**

* Se tenga feedback real de uso

---

## Final Note

> Estas decisiones existen para proteger el producto de la improvisación.
> Si una nueva idea las contradice, probablemente **no es una buena idea aún**.
