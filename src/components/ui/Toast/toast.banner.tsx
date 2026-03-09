/**
 * @fileoverview Componente visual `ToastBanner`.
 *
 * @remarks
 * Renderiza el banner animado. Gestiona entrada/salida con Reanimated
 * y el timer de auto-dismiss. Es un componente interno — no se exporta
 * directamente; lo monta `ToastProvider`.
 *
 * @internal
 */

import React, { useCallback, useContext, useEffect, useRef } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { emitter } from './toast.emitter';
import { CheckIcon, CloseIcon, InfoIcon, Spinner, TriangleIcon, XCircleIcon } from './toast.icons';
import { DEFAULTS, H_PAD, SPRING_CFG, SB_H, TOAST_W, hexAlpha } from './toast.theme';
import { ToastGlobalConfig, ToastState, ToastTheme } from './toast.types';

// ─────────────────────────────────────────────────────────────────────────────

/** @internal Contexto que transporta la config global desde `ToastProvider`. */
export const ConfigCtx = React.createContext<ToastGlobalConfig>({});

// ─────────────────────────────────────────────────────────────────────────────

interface ToastBannerProps {
  state:  ToastState;
  onHide: () => void;
}

/** @internal Banner animado de un toast activo. */
export const ToastBanner = ({ state, onHide }: ToastBannerProps) => {
  const globalCfg = useContext(ConfigCtx);

  const {
    type, title, message, duration, position,
    style, titleStyle, messageStyle, icon, resolve,
  } = state;

  // Merge: built-in defaults ← provider config (por tipo)
  const theme: Required<ToastTheme> = { ...DEFAULTS[type], ...globalCfg[type] };

  const isTop = position === 'top';
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animated values
  const ty = useSharedValue(isTop ? -120 : 120);
  const op = useSharedValue(0);
  const sc = useSharedValue(0.94);

  // Llama a onHide (limpia state en Provider) y resolve (Promise pública)
  const finish = useCallback(() => {
    onHide();
    resolve();
  }, [onHide, resolve]);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    ty.value = withTiming(isTop ? -120 : 120, {
      duration: 260,
      easing: Easing.in(Easing.cubic),
    });
    op.value = withTiming(0, { duration: 220 });
    sc.value = withTiming(0.94, { duration: 220 }, () => runOnJS(finish)());
  }, [isTop, ty, op, sc, finish]);

  // Entrada + auto-dismiss
  useEffect(() => {
    ty.value = withSpring(0, SPRING_CFG);
    op.value = withTiming(1, { duration: 160 });
    sc.value = withSpring(1, SPRING_CFG);

    if (duration > 0) {
      timer.current = setTimeout(dismiss, duration);
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [duration, dismiss, ty, op, sc]);

  // Registra dismiss para toast.hide()
  useEffect(() => {
    emitter.onHide(dismiss);
  }, [dismiss]);

  const animStyle = useAnimatedStyle(() => ({
    opacity:   op.value,
    transform: [{ translateY: ty.value }, { scale: sc.value }],
  }));

  const accent = theme.accent;
  const iconEl = icon ?? (() => {
    const p = { color: accent, size: 16 };
    switch (type) {
      case 'success': return <CheckIcon    {...p} />;
      case 'error':   return <XCircleIcon  {...p} />;
      case 'warning': return <TriangleIcon {...p} />;
      case 'info':    return <InfoIcon     {...p} />;
      case 'loading': return <Spinner      color={accent} size={17} />;
    }
  })();

  return (
    <Animated.View
      style={[
        s.banner,
        isTop ? s.posTop : s.posBottom,
        {
          backgroundColor: theme.bg,
          borderColor:     hexAlpha(accent, 0.18),
          borderRadius:    theme.radius,
          shadowColor:     accent,
        },
        style,
        animStyle,
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      {/* Línea de acento superior */}
      <View style={[s.topLine, { backgroundColor: hexAlpha(accent, 0.5) }]} />

      {/* Ícono */}
      <View style={s.iconWrap}>
        {iconEl}
      </View>

      {/* Texto */}
      <View style={s.textWrap}>
        <Text style={[s.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
        {!!message && (
          <Text style={[s.subtitle, messageStyle]} numberOfLines={2}>
            {message}
          </Text>
        )}
      </View>

      {/* Badge de tipo */}
      <Text style={[s.badge, { color: hexAlpha(accent, 0.55) }]}>
        {type}
      </Text>

      {/* Cerrar */}
      <TouchableOpacity
        onPress={dismiss}
        style={s.closeBtn}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Cerrar"
      >
        <CloseIcon color="rgba(255,255,255,0.18)" size={10} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  banner: {
    position:        'absolute',
    left:            H_PAD,
    width:           TOAST_W,
    flexDirection:   'row',
    alignItems:      'center',
    borderWidth:     1,
    paddingVertical: 11,
    paddingRight:    10,
    overflow:        'hidden',
    // iOS shadow
    shadowOffset:    { width: 0, height: 8 },
    shadowOpacity:   0.25,
    shadowRadius:    20,
    // Android
    elevation:       12,
    zIndex:          9999,
  },

  posTop: {
    top: Platform.OS === 'ios' ? 58 : SB_H + 14,
  },
  posBottom: {
    bottom: Platform.OS === 'ios' ? 44 : 24,
  },

  // Línea de 1px en el borde superior
  topLine: {
    position:     'absolute',
    top:          0,
    left:         16,
    right:        16,
    height:       1,
  },

  iconWrap: {
    width:          34,
    height:         34,
    justifyContent: 'center',
    alignItems:     'center',
    marginLeft:     12,
    marginRight:    10,
  },

  textWrap: {
    flex: 1,
  },

  title: {
    color:         '#e8e8ed',
    fontSize:      13,
    fontWeight:    '500',
    letterSpacing: 0.1,
    ...Platform.select({ android: { fontFamily: 'sans-serif-medium' } }),
  },

  subtitle: {
    color:      'rgba(232,232,237,0.4)',
    fontSize:   11.5,
    marginTop:  2,
    lineHeight: 16,
    ...Platform.select({ android: { fontFamily: 'sans-serif' } }),
  },

  // Texto pequeño del tipo (success, error…)
  badge: {
    fontSize:      9,
    fontWeight:    '500',
    letterSpacing: 0.6,
    marginLeft:    8,
    marginRight:   4,
    ...Platform.select({ android: { fontFamily: 'sans-serif' } }),
  },

  closeBtn: {
    width:           24,
    height:          24,
    borderRadius:    6,
    justifyContent:  'center',
    alignItems:      'center',
    marginLeft:      4,
  },
});
