# Domain Layer

Esta capa contiene la lógica de negocio pura del AI Context Control Plane.

## Estructura
- `types/`: Definiciones de Tipos de Datos (TS).
- `catalogs/`: Catálogos estáticos (Reglas, Comandos, Presets).
- `resolver/`: Lógica de compilación del contrato (Pure Functions).
- `contracts/`: Estructuras de los contratos resueltos.

## Reglas
- ❌ NO importar de `infra` ni de Next.js.
- ❌ NO realizar llamadas de red o acceso a disco.
- ✅ Solo funciones puras y tipos deterministas.
