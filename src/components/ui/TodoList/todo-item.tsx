import { TodoWithPhotos } from '@src/db/schema';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { CompleteBackground } from './complete-background';
import { DeleteBackground } from './delete-background';

type Props = {
  todo: TodoWithPhotos;
  onPress?: (todo: TodoWithPhotos) => void;
  onSwipeRight?: (todo: TodoWithPhotos) => void;
  onSwipeLeft?: (todo: TodoWithPhotos) => void;
  onDoubleTap?: (todo: TodoWithPhotos) => void;
  onLongPress?: (todo: TodoWithPhotos) => void;
};

const formatDate = (date?: Date | null) => {
  if (!date) return '';
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const PRIORITY_COLORS = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
  urgent: '#7C3AED',
};

export const TodoItem = ({ todo, onPress, onSwipeRight, onSwipeLeft, onDoubleTap, onLongPress }: Props) => {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((e) => { translateX.value = e.translationX; })
    .onEnd((e) => {
      if (e.translationX > 100) onSwipeRight?.(todo);
      else if (e.translationX < -100) onSwipeLeft?.(todo);
      translateX.value = withSpring(0);
    });

  const doubleTap = Gesture.Tap()
    .runOnJS(true)
    .numberOfTaps(2)
    .onEnd(() => onDoubleTap?.(todo));

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 10 ? 1 : 0,
  }));

  const completeStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -10 ? 1 : 0,
  }));

  const priorityColor = PRIORITY_COLORS[todo.priority];

  return (
    <GestureDetector gesture={Gesture.Simultaneous(pan, doubleTap)}>
      <Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, deleteStyle]}>
          <DeleteBackground />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, completeStyle]}>
          <CompleteBackground />
        </Animated.View>

        <Animated.View style={animStyle}>
          <Pressable
            onPress={() => onPress?.(todo)}
            onLongPress={() => onLongPress?.(todo)}
            delayLongPress={400}
            style={({ pressed }) => [
              styles.container,
              pressed && styles.containerPressed,
            ]}
          >
            {/* Barra de prioridad */}
            <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />

            {/* Contenido */}
            <View style={styles.content}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.title,
                    todo.completed && styles.titleCompleted,
                  ]}
                  numberOfLines={2}
                >
                  {todo.title}
                </Text>

                {todo.photos[0]?.uri && (
                  <Image
                    style={styles.image}
                    source={todo.photos[0].uri}
                    contentFit="cover"
                  />
                )}
              </View>

              <View style={styles.footer}>
                <Text style={styles.date}>{formatDate(todo.createdAt)}</Text>
                <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginVertical: 4,
  },
  containerPressed: {
    backgroundColor: '#2C2C2E',
  },
  priorityBar: {
    width: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
    color: '#F2F2F7',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.28)',
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  image: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
});