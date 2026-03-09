/**
 * @fileoverview Tokens de diseño por defecto del sistema de toasts.
 *
 * @remarks
 * Paleta intencionalmente sobria: fondos casi negros con acentos sutiles.
 * Se puede sobreescribir globalmente via `ToastProvider.config` o
 * por llamada via `ToastOptions.style`.
 *
 * @internal
 */

import { Dimensions, Platform, StatusBar } from 'react-native';
import { ToastTheme, ToastType } from './toast.types';

// ─── Layout ──────────────────────────────────────────────────────────────────

export const { width: SCREEN_W } = Dimensions.get('window');
export const SB_H    = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;
export const H_PAD   = 16;
export const TOAST_W = SCREEN_W - H_PAD * 2;

// ─── Animation ───────────────────────────────────────────────────────────────

export const SPRING_CFG = { damping: 24, stiffness: 280, mass: 0.6 };

// ─── Color defaults ───────────────────────────────────────────────────────────

/**
 * Valores de diseño por defecto para cada tipo de toast.
 * Minimalistas: fondo oscuro tintado + acento de baja saturación.
 */
export const DEFAULTS: Record<ToastType, Required<ToastTheme>> = {
  success: { bg: '#0c110e', accent: '#4ade80', radius: 14, duration: 3500 },
  error:   { bg: '#110c0c', accent: '#f87171', radius: 14, duration: 3500 },
  warning: { bg: '#110f0c', accent: '#fbbf24', radius: 14, duration: 3500 },
  info:    { bg: '#0c0e11', accent: '#93c5fd', radius: 14, duration: 3500 },
  loading: { bg: '#0e0c11', accent: '#c4b5fd', radius: 14, duration: 0    },
};

/**
 * Convierte un color hex `#rrggbb` en `rgba(r,g,b,alpha)`.
 * Usado para generar variantes semitransparentes del acento.
 */
export const hexAlpha = (hex: string, a: number): string => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};
