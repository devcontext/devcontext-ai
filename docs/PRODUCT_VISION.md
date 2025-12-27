# AI Context Control Plane

> *Diseñar, curar y gobernar el contexto de la IA de forma deliberada.*

---

## 1. El problema (validado por el mercado)

Los desarrolladores no tienen problemas porque la IA sea poco inteligente.
Tienen problemas porque la IA **no tiene contexto estable ni límites claros**.

En proyectos reales:

* La IA ignora decisiones arquitectónicas previas
* Sobredimensiona tareas simples
* Introduce dependencias no deseadas
* Cambia su comportamiento entre sesiones

La causa raíz **no son los malos prompts**.
Es la ausencia de **contexto explícito, reutilizable y versionado**.

---

## 2. Usuario objetivo

**Desarrollador individual (solo dev)** que:

* Usa herramientas de IA a diario (Cursor, ChatGPT, Gemini)
* Trabaja en proyectos reales y duraderos
* Valora la consistencia, limpieza y control
* Está cansado de reexplicar su proyecto a la IA

El producto es **solo-dev first** por diseño.

---

## 3. Qué es este producto

AI Context Control Plane es una **plataforma de ingeniería de contexto**.

Permite a los desarrolladores:

* Crear contexto a partir de fuentes reales (código, documentos, decisiones)
* Refinar ese contexto con ayuda de la IA
* Versionarlo, restaurarlo y mantenerlo en el tiempo
* Exponerlo de forma segura a herramientas de IA mediante MCP

La IA **propone** contexto.
El humano **decide**.

---

## 4. Qué NO es este producto

Este producto NO es:

* Un gestor de prompts
* Un wrapper de chat
* Un almacén de memoria sin estructura
* Una wiki de documentación

Aquí el contexto se **diseña y gobierna**, no se acumula sin control.

---

## 5. Propuesta de valor

> **Convertir conocimiento bruto del proyecto en contexto explícito y versionado que la IA pueda respetar de forma fiable.**

---

## 6. Insight clave

La memoria no estructurada no escala.

Sin curación:

* El contexto se contradice
* Decisiones antiguas contaminan trabajo nuevo
* El comportamiento de la IA se vuelve impredecible

El contexto debe ser **intencional, versionado y auditable**.

---

## 7. Principios de producto

1. **Contexto antes que comandos**
   El contexto se crea y valida antes de consumirse.

2. **La IA asiste, el humano decide**
   La IA genera borradores, el humano aprueba.

3. **Predictibilidad sobre flexibilidad**
   Menos opciones, más garantías.

4. **Todo es versionable**
   El contexto evoluciona y su historia importa.

5. **Explícito mejor que implícito**
   Si la IA debe respetarlo, debe estar escrito.

---

## 8. Flujo de uso (alto nivel)

1. Crear un workspace / proyecto
2. Añadir fuentes (documentos, código, texto)
3. Generar un borrador de contexto guiado
4. Editar y guardar como contexto versionado
5. Consumirlo desde herramientas de IA vía MCP

---

## 9. Rol de los comandos (redefinido)

Los comandos **no son el punto de entrada**.
Son la **capa de consumo** del contexto.

Una vez el contexto es confiable:

* Los comandos lo aplican de forma consistente
* El comportamiento de la IA se vuelve repetible

---

## 10. Definición de éxito

El producto tiene éxito si:

* El desarrollador deja de reescribir prompts
* El contexto se reutiliza entre sesiones
* La IA se siente predecible, estable y correcta

---

## 11. Declaración final

> La IA no debería recordarlo todo.
> Debería recordar **lo que importa**, por diseño.
