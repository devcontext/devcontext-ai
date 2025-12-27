# MVP — Context Composer (Beta)

## Objetivo del MVP

Validar que un **desarrollador individual** puede crear, confiar y reutilizar contexto explícito para IA **sin escribir prompts**.

El MVP debe demostrar que:

* La creación de contexto es el verdadero punto de entrada
* El contexto versionado mejora la predictibilidad de la IA

---

## 1. Usuario objetivo

* Solo developer
* Usuario diario de IA
* Proyectos reales

Sin equipos. Sin colaboración.

---

## 2. Caso de uso principal

> “Quiero que la IA entienda mi proyecto de forma consistente, sin tener que explicarlo cada vez.”

---

## 3. Alcance del MVP

### 3.1 Workspace / Proyecto

* Crear workspace
* Múltiples contextos por workspace

---

### 3.2 Context Composer Lite (core del MVP)

**Paso 1 — Añadir fuente**

* Subir documento (md / txt / pdf)
* Pegar texto

**Paso 2 — Elegir modo**

* Solo referencia
* Generar resumen de contexto
* Ambos

**Paso 3 — Generación guiada**

* Visión general del proyecto
* Notas de arquitectura
* Reglas y restricciones
* Contexto de onboarding

**Paso 4 — Editor de borrador**

* Markdown editable
* Guardar como versión 1

---

### 3.3 Versionado

* Cada guardado crea una nueva versión
* Posibilidad de restaurar cualquier versión

---

### 3.4 Context Store

* Listado de contextos
* Filtros por tipo y tags
* Estado vacío claro

---

### 3.5 Integración MCP (mínima)

* Servidor MCP propio
* Acceso por token
* Setup manual (copiar configuración)

---

## 4. Fuera de alcance explícito

* Equipos
* Reglas personalizadas
* UI de comandos
* Analíticas
* Billing

---

## 5. Criterios de validación

El MVP está validado si:

* Lo usas a diario
* Reutilizas contextos
* La IA mejora sin editar prompts

---

## 6. Criterios de cancelación

Parar si:

* Crear contexto no aporta valor
* Los usuarios solo piden editar prompts

---

## 7. Regla guía

> Si no mejora la calidad del contexto, no entra en el MVP.
