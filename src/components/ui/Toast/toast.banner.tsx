/**
 * @fileoverview Componente visual `ToastBanner` — rediseño minimalista.
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
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
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
import { DEFAULTS, H_PAD, SB_H, SPRING_CFG, TOAST_W } from './toast.theme';
import { ToastGlobalConfig, ToastState, ToastTheme } from './toast.types';

export const ConfigCtx = React.createContext<ToastGlobalConfig>({});

interface ToastBannerProps {
  state:  ToastState;
  onHide: () => void;
}

export const ToastBanner = ({ state, onHide }: ToastBannerProps) => {
  const globalCfg = useContext(ConfigCtx);

  const {
    type, title, message, duration, position,
    style, titleStyle, messageStyle, icon, resolve,
  } = state;

  const theme: Required<ToastTheme> = { ...DEFAULTS[type], ...globalCfg[type] };

  const isTop = position === 'top';
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ty = useSharedValue(isTop ? -80 : 80);
  const tx = useSharedValue(0);
  const op = useSharedValue(0);
  const sc = useSharedValue(0.97);

  // Umbral horizontal para considerar el gesto como swipe
  const SWIPE_THRESHOLD = TOAST_W * 0.35;

  const finish = useCallback(() => {
    onHide();
    resolve();
  }, [onHide, resolve]);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    ty.value = withTiming(isTop ? -80 : 80, {
      duration: 220,
      easing: Easing.in(Easing.cubic),
    });
    op.value = withTiming(0, { duration: 180 });
    sc.value = withTiming(0.97, { duration: 180 }, () => runOnJS(finish)());
  }, [isTop, ty, op, sc, finish]);

  const dismissX = useCallback((direction: 1 | -1) => {
    if (timer.current) clearTimeout(timer.current);
    tx.value = withTiming(direction * (TOAST_W + H_PAD * 2), {
      duration: 240,
      easing: Easing.in(Easing.cubic),
    });
    op.value = withTiming(0, { duration: 200 }, () => runOnJS(finish)());
  }, [tx, op, finish]);

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-8, 8])
    .onUpdate(e => {
      tx.value = e.translationX;
      // Fade sutil al arrastrar
      op.value = Math.max(0.4, 1 - Math.abs(e.translationX) / (TOAST_W * 0.6));
    })
    .onEnd(e => {
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD || Math.abs(e.velocityX) > 600) {
        const dir = e.translationX > 0 ? 1 : -1;
        runOnJS(dismissX)(dir);
      } else {
        // Vuelve a su lugar con spring
        tx.value = withSpring(0, { damping: 20, stiffness: 300 });
        op.value = withTiming(1, { duration: 150 });
      }
    });

  useEffect(() => {
    ty.value = withSpring(0, SPRING_CFG);
    op.value = withTiming(1, { duration: 200 });
    sc.value = withSpring(1, SPRING_CFG);

    if (duration > 0) {
      timer.current = setTimeout(dismiss, duration);
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [duration, dismiss, ty, op, sc]);

  useEffect(() => {
    emitter.onHide(dismiss);
  }, [dismiss]);

  const animStyle = useAnimatedStyle(() => ({
    opacity:   op.value,
    transform: [{ translateY: ty.value }, { translateX: tx.value }, { scale: sc.value }],
  }));

  const accent = theme.accent;

  const iconEl = icon ?? (() => {
    const p = { color: accent, size: 15 };
    switch (type) {
      case 'success': return <CheckIcon    {...p} />;
      case 'error':   return <XCircleIcon  {...p} />;
      case 'warning': return <TriangleIcon {...p} />;
      case 'info':    return <InfoIcon     {...p} />;
      case 'loading': return <Spinner      color={accent} size={16} />;
    }
  })();

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View
        style={[
          s.banner,
          isTop ? s.posTop : s.posBottom,
          {
            backgroundColor: theme.bg,
            borderRadius:    theme.radius,
          },
          style,
          animStyle,
        ]}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        {/* Barra de acento izquierda — minimalista */}
        <View style={[s.accentBar, { backgroundColor: accent }]} />

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

        {/* Cerrar */}
        <TouchableOpacity
          onPress={dismiss}
          style={s.closeBtn}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
        >
          <CloseIcon color="rgba(255,255,255,0.25)" size={9} />
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

const s = StyleSheet.create({
  banner: {
    position:        'absolute',
    left:            H_PAD,
    width:           TOAST_W,
    flexDirection:   'row',
    alignItems:      'center',
    overflow:        'hidden',
    paddingVertical: 13,
    paddingRight:    12,
    // iOS shadow — muy sutil
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.35,
    shadowRadius:    16,
    // Android
    elevation:       10,
    zIndex:          9999,
  },

  posTop: {
    top: Platform.OS === 'ios' ? 58 : SB_H + 14,
  },
  posBottom: {
    bottom: Platform.OS === 'ios' ? 44 : 24,
  },

  // Barra vertical izquierda — señal de tipo sin ruido
  accentBar: {
    width:        3,
    alignSelf:    'stretch',
    borderRadius: 2,
    marginLeft:   14,
    marginRight:  12,
    marginVertical: 2,
  },

  iconWrap: {
    width:          28,
    height:         28,
    justifyContent: 'center',
    alignItems:     'center',
    marginRight:    10,
  },

  textWrap: {
    flex: 1,
  },

  title: {
    color:         'rgba(255,255,255,0.92)',
    fontSize:      13.5,
    fontWeight:    '500',
    letterSpacing: 0.05,
    ...Platform.select({ android: { fontFamily: 'sans-serif-medium' } }),
  },

  subtitle: {
    color:      'rgba(255,255,255,0.38)',
    fontSize:   12,
    marginTop:  2,
    lineHeight: 17,
    ...Platform.select({ android: { fontFamily: 'sans-serif' } }),
  },

  closeBtn: {
    width:          22,
    height:         22,
    justifyContent: 'center',
    alignItems:     'center',
    marginLeft:     6,
  },
});