/**
 * @fileoverview Tokens de diseño — tema minimalista.
 * @internal
 */

import { Dimensions, Platform, StatusBar } from 'react-native';
import { ToastTheme, ToastType } from './toast.types';

export const { width: SCREEN_W } = Dimensions.get('window');
export const SB_H    = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;
export const H_PAD   = 16;
export const TOAST_W = SCREEN_W - H_PAD * 2;

export const SPRING_CFG = { damping: 26, stiffness: 300, mass: 0.55 };

/**
 * Fondos más neutros (casi-negro uniforme), acentos puros y limpios.
 * Radio más pequeño = sensación más seria/moderna.
 */
export const DEFAULTS: Record<ToastType, Required<ToastTheme>> = {
  success: { bg: '#111312', accent: '#4ade80', radius: 10, duration: 3500 },
  error:   { bg: '#131111', accent: '#f87171', radius: 10, duration: 3500 },
  warning: { bg: '#131210', accent: '#fbbf24', radius: 10, duration: 3500 },
  info:    { bg: '#101113', accent: '#60a5fa', radius: 10, duration: 3500 },
  loading: { bg: '#111113', accent: '#a78bfa', radius: 10, duration: 0    },
};

export const hexAlpha = (hex: string, a: number): string => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};