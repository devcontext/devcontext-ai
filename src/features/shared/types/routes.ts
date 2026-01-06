/**
 * Tipos compartidos para el sistema de rutas de la aplicación
 *
 * Este archivo contiene definiciones de tipos que son utilizados
 * por todas las features para implementar el sistema de rutas centralizado.
 */

import { LucideIcon } from "lucide-react";

/**
 * Tipo para una ruta básica
 */
export interface BaseRoute {
  /** Patrón de la ruta (puede incluir parámetros como :id) */
  path: string;
  /** Título para la página (usado en metadatos) */
  title: string;
  /** Descripción para la página (usado en metadatos) */
  description: string;

  /** Icono para la página (usado en metadatos) */
  icon?: LucideIcon;
}

/**
 * Tipo para una ruta con parámetros dinámicos
 */
export interface DynamicRoute<
  T extends Record<string, string | number>,
> extends BaseRoute {
  /** Función para generar la URL con parámetros */
  generatePath: (params: T) => string;
}

/**
 * Utilidad para obtener los metadatos de una ruta
 */
export function getRouteMetadata(route: BaseRoute) {
  return {
    title: route.title,
    description: route.description,
  };
}
