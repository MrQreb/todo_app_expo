/**
 * @fileoverview Íconos SVG internos del sistema de toasts.
 *
 * @remarks
 * Íconos Feather-style, trazo fino (strokeWidth 1.6–2).
 * Intencionalmente discretos para complementar la UI minimalista.
 *
 * @internal
 */

import React, { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

// ─────────────────────────────────────────────────────────────────────────────

interface IconProps {
  color: string;
  /** @defaultValue 16 */
  size?: number;
}

// ─────────────────────────────────────────────────────────────────────────────

/** Círculo con checkmark — success */
export const CheckIcon = ({ color, size = 16 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.6" />
    <Polyline
      points="8.5 12 11 14.5 15.5 9.5"
      stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

/** Círculo con X — error */
export const XCircleIcon = ({ color, size = 16 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.6" />
    <Line x1="15" y1="9"  x2="9"  y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Line x1="9"  y1="9"  x2="15" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

/** Triángulo con ! — warning */
export const TriangleIcon = ({ color, size = 16 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    />
    <Line x1="12" y1="9"  x2="12"    y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </Svg>
);

/** Círculo con i — info */
export const InfoIcon = ({ color, size = 16 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.6" />
    <Line x1="12" y1="16"   x2="12"    y2="11.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Line x1="12" y1="8"    x2="12.01" y2="8"    stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </Svg>
);

/** X pequeña — botón cerrar */
export const CloseIcon = ({ color, size = 10 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="18" y1="6"  x2="6"  y2="18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="6"  y1="6"  x2="18" y2="18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </Svg>
);

/**
 * Spinner animado con Reanimated — usado en tipo `loading`.
 * Arco SVG giratorio sobre una pista semitransparente.
 */
export const Spinner = ({ color, size = 18 }: IconProps) => {
  const rot = useSharedValue(0);

  useEffect(() => {
    const tick = () => {
      rot.value = 0;
      rot.value = withTiming(360, { duration: 900, easing: Easing.linear });
    };
    tick();
    const id = setInterval(tick, 900);
    return () => clearInterval(id);
  }, [rot]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot.value}deg` }],
  }));

  return (
    <Animated.View style={style}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
        <Path
          d="M12 2a10 10 0 0 1 10 10"
          stroke={color} strokeWidth="2" strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
};
