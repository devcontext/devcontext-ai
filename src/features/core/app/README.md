# Application Layer

Esta capa orquestra la ejecución de los casos de uso, uniendo el `domain` y el `infra`.

## Responsabilidades
- Recibir una petición (API/UI).
- Cargar datos necesarios mediante `infra`.
- Ejecutar la lógica del `resolver` (domain).
- Registrar logs de resolución.
- Gestionar API Keys.

## Reglas
- ✅ Coordina el flujo de datos.
- ❌ Evita duplicar lógica que pertenezca al Resolver.
