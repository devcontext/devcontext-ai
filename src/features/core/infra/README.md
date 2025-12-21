# Infrastructure Layer

Esta capa contiene los adaptadores para servicios externos y persistencia.

## Estructura
- `db/`: Clientes y Repositorios de Supabase.

## Reglas
- ✅ Aquí vive la dependencia de Supabase.
- ❌ NO debe contener lógica de negocio (esa vive en `domain`).
- ✅ Traduce modelos de base de datos a modelos de dominio.
