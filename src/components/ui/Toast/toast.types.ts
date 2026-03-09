/**
 * @fileoverview Tipos públicos del sistema de toasts.
 * @packageDocumentation
 */

import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────

/** Variante visual del toast — determina colores e ícono. */
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

/** Dónde aparece el toast en la pantalla. */
export type ToastPosition = 'top' | 'bottom';

/**
 * Tokens de diseño personalizables por tipo de toast.
 * Se definen globalmente en `ToastProvider` y se mezclan con los valores por defecto.
 */
export interface ToastTheme {
  /** Color de fondo del banner. */
  bg?: string;
  /** Color principal: ícono, borde y badge. */
  accent?: string;
  /** Border-radius del banner. */
  radius?: number;
  /** Duración por defecto en ms para este tipo. */
  duration?: number;
}

/**
 * Opciones al disparar un toast individual.
 * Sobreescriben los valores globales del `ToastProvider`.
 *
 * @example
 * ```ts
 * toast.error('Falló', {
 *   message:    'El servidor no respondió.',
 *   duration:   6000,
 *   position:   'bottom',
 *   titleStyle: { fontSize: 15 },
 * });
 * ```
 */
export interface ToastOptions {
  /** Texto secundario debajo del título. Máximo 2 líneas. */
  message?: string;
  /**
   * Duración en ms antes de ocultarse automáticamente.
   * Usa `0` para toast persistente (sticky).
   * @defaultValue 3500
   */
  duration?: number;
  /**
   * Posición vertical del toast.
   * @defaultValue 'top'
   */
  position?: ToastPosition;
  /** Estilos extra para el contenedor del banner. */
  style?: ViewStyle;
  /** Estilos extra para el título. */
  titleStyle?: TextStyle;
  /** Estilos extra para el mensaje secundario. */
  messageStyle?: TextStyle;
  /** Ícono personalizado — reemplaza el predeterminado. */
  icon?: React.ReactNode;
}

/** @internal Estado completo de un toast activo. */
export interface ToastState extends ToastOptions {
  id:       number;
  type:     ToastType;
  title:    string;
  duration: number;
  position: ToastPosition;
  resolve:  () => void;
}

/** @internal Configuración global pasada al `ToastProvider`. */
export type ToastGlobalConfig = Partial<Record<ToastType, ToastTheme>>;
