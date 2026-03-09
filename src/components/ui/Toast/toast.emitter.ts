/**
 * @fileoverview Emitter singleton — canal interno entre `toast.*` y `ToastProvider`.
 *
 * @remarks
 * Usa variables de módulo simples para que `toast.*` funcione sin hooks
 * ni contexto en el sitio de llamada.
 *
 * @internal
 */

import { ToastState } from './toast.types';

type ShowCb = (s: ToastState) => void;
type HideCb = () => void;

let _show: ShowCb | null = null;
let _hide: HideCb | null = null;

/** Contador incremental para IDs únicos por toast. */
export let _seq = 0;
export const nextId = () => ++_seq;

/**
 * Canal de comunicación interno.
 * `ToastProvider` registra los listeners; `toast.*` los dispara.
 */
export const emitter = {
  /** Registra el listener que mostrará el toast (llamado por `ToastProvider`). */
  onShow: (fn: ShowCb): void => { _show = fn; },
  /** Registra el listener que ocultará el toast (llamado por `ToastBanner`). */
  onHide: (fn: HideCb): void => { _hide = fn; },
  /** Emite un nuevo toast. */
  show:   (s: ToastState): void => { _show?.(s); },
  /** Oculta el toast activo. */
  hide:   (): void => { _hide?.(); },
};
