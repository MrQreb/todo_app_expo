/**
 * @fileoverview API pública y `ToastProvider` del sistema de toasts.
 *
 * @remarks
 * Punto de entrada principal. Re-exporta todo lo necesario para usar el sistema:
 * - `toast` — objeto con métodos `success`, `error`, `warning`, `info`, `loading`, `hide`, `promise`.
 * - `ToastProvider` — componente que debe envolver la raíz de la app una sola vez.
 *
 * @example Setup
 * ```tsx
 * // app/_layout.tsx
 * import { ToastProvider } from '@/components/toast';
 *
 * export default function RootLayout() {
 *   return (
 *     <ToastProvider>
 *       <Stack />
 *     </ToastProvider>
 *   );
 * }
 * ```
 *
 * @example Uso simple
 * ```ts
 * import { toast } from '@/components/toast';
 *
 * toast.success('Guardado')
 * toast.error('Sin conexión', { message: 'Revisa tu red.' })
 * toast.warning('Espacio casi lleno', { duration: 5000 })
 * toast.info('Nueva versión', { position: 'bottom' })
 * ```
 *
 * @example Async — espera a que el toast se cierre
 * ```ts
 * toast.loading('Guardando…')
 * await api.save(data)
 * toast.hide()
 * await toast.success('¡Listo!')
 * router.push('/home')  // corre DESPUÉS de que el toast desaparece
 * ```
 *
 * @example toast.promise — wrapper automático
 * ```ts
 * const user = await toast.promise(api.fetchUser(id), {
 *   loading: 'Cargando usuario…',
 *   success: 'Usuario cargado',
 *   error:   'No se pudo cargar',
 * });
 * ```
 *
 * @example Personalización global
 * ```tsx
 * <ToastProvider
 *   config={{
 *     success: { accent: '#4ade80', radius: 8 },
 *     error:   { accent: '#f87171', duration: 6000 },
 *   }}
 * >
 *   <App />
 * </ToastProvider>
 * ```
 *
 * @example Personalización por llamada
 * ```ts
 * toast.info('Sincronizado', {
 *   style:        { borderRadius: 6 },
 *   titleStyle:   { fontWeight: '600' },
 *   icon:         <MiIcono />,
 * })
 * ```
 *
 * @packageDocumentation
 */

import React, { useCallback, useEffect, useState } from 'react';
import { ConfigCtx, ToastBanner } from './toast.banner';
import { emitter, nextId } from './toast.emitter';
import { ToastGlobalConfig, ToastOptions, ToastState, ToastType } from './toast.types';

// Re-export types for consumers
export type {
  ToastGlobalConfig,
  ToastOptions,
  ToastPosition,
  ToastTheme,
  ToastType
} from './toast.types';

// ─────────────────────────────────────────────────────────────────────────────
// Core factory
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fábrica interna. Devuelve una función que dispara un toast del tipo dado
 * y retorna una `Promise<void>` que se resuelve cuando el toast se cierra.
 */
const make =
  (type: ToastType) =>
  (title: string, opts?: ToastOptions): Promise<void> =>
    new Promise<void>(resolve => {
      emitter.show({
        id:       nextId(),
        type,
        title,
        duration: opts?.duration ?? 3500,
        position: opts?.position ?? 'top',
        resolve,
        ...opts,
      });
    });

// ─────────────────────────────────────────────────────────────────────────────
// toast.promise helper (fuera del objeto para evitar auto-referencia)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ejecuta una promesa mostrando los estados loading → success/error de forma automática.
 *
 * @param promise  - Promesa a ejecutar.
 * @param messages - Textos para cada estado.
 * @param opts     - Opciones adicionales (position, style, etc.).
 * @returns El valor resuelto de la promesa original.
 *
 * @example
 * ```ts
 * const data = await toast.promise(api.save(payload), {
 *   loading: 'Guardando…',
 *   success: '¡Guardado!',
 *   error:   'Error al guardar',
 * });
 * ```
 */
async function toastPromise<T>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string },
  opts?: ToastOptions,
): Promise<T> {
  make('loading')(messages.loading, { ...opts, duration: 0 });
  try {
    const result = await promise;
    emitter.hide();
    await make('success')(messages.success, opts);
    return result;
  } catch (err) {
    emitter.hide();
    await make('error')(messages.error, opts);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Objeto global de toasts. No requiere hooks ni contexto en el sitio de llamada.
 *
 * Cada método (excepto `hide`) devuelve una `Promise<void>` que se resuelve
 * cuando el toast se cierra — útil para secuenciar acciones con `await`.
 */
export const toast = {
  /**
   * Toast de operación exitosa.
   * @param title - Título principal.
   * @param opts  - Opciones adicionales.
   */
  success: make('success'),

  /**
   * Toast de error o fallo.
   * @param title - Título principal.
   * @param opts  - Opciones adicionales.
   */
  error: make('error'),

  /**
   * Toast de advertencia.
   * @param title - Título principal.
   * @param opts  - Opciones adicionales.
   */
  warning: make('warning'),

  /**
   * Toast informativo.
   * @param title - Título principal.
   * @param opts  - Opciones adicionales.
   */
  info: make('info'),

  /**
   * Toast de carga con spinner. **Sticky por defecto** (`duration: 0`).
   * Usa {@link toast.hide} para cerrarlo manualmente.
   * @param title - Título principal.
   * @param opts  - Opciones adicionales (puede sobreescribir `duration`).
   */
  loading: (title: string, opts?: ToastOptions): Promise<void> =>
    make('loading')(title, { duration: 0, ...opts }),

  /**
   * Cierra el toast activo inmediatamente con animación de salida.
   * Resuelve la Promise asociada al toast.
   */
  hide: (): void => emitter.hide(),

  /**
   * Wrapper async — muestra loading, luego success o error según el resultado.
   * @see {@link toastPromise}
   */
  promise: toastPromise,
};

// ─────────────────────────────────────────────────────────────────────────────
// ToastProvider
// ─────────────────────────────────────────────────────────────────────────────

export interface ToastProviderProps {
  children: React.ReactNode;
  /**
   * Personalización global por tipo de toast.
   * Se mezcla con los valores por defecto; solo especifica lo que quieres cambiar.
   *
   * @example
   * ```tsx
   * <ToastProvider config={{ success: { accent: '#4ade80', radius: 8 } }}>
   * ```
   */
  config?: ToastGlobalConfig;
}

/**
 * Proveedor del sistema de toasts.
 *
 * @remarks
 * Colócalo **una sola vez** en la raíz de tu aplicación, fuera de cualquier
 * navegador u otro contenedor. Los toasts flotarán sobre todo el árbol.
 *
 * @example
 * ```tsx
 * export default function RootLayout() {
 *   return (
 *     <ToastProvider>
 *       <Stack />
 *     </ToastProvider>
 *   );
 * }
 * ```
 */
export const ToastProvider = ({
  children,
  config = {},
}: ToastProviderProps): React.JSX.Element => {
  const [state, setState] = useState<ToastState | null>(null);

  useEffect(() => {
    emitter.onShow(next => setState(next));
  }, []);

  const handleHide = useCallback(() => setState(null), []);

  return (
    <ConfigCtx.Provider value={config}>
      {children}
      {state !== null && (
        <ToastBanner state={state} onHide={handleHide} />
      )}
    </ConfigCtx.Provider>
  );
};
