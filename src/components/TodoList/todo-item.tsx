import { Todo } from '@/src/db/schema';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { CompleteBackground } from './complete-background';
import { DeleteBackground } from './delete-background';

type Props = {
  todo: Todo;
  dark: boolean;
  onPress?: (todo: Todo) => void;
  onSwipeRight?: (todo: Todo) => void;
  onSwipeLeft?: (todo: Todo) => void;
  onDoubleTap?: (todo: Todo) => void;
};

export const TodoItem = ({ todo, dark, onPress, onSwipeRight, onSwipeLeft, onDoubleTap }: Props) => {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
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

  // Solo muestra el fondo rojo al deslizar derecha
  const deleteStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 10 ? 1 : 0,
  }));

  // Solo muestra el fondo verde al deslizar izquierda
  const completeStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -10 ? 1 : 0,
  }));

  return (
    <GestureDetector gesture={Gesture.Simultaneous(pan, doubleTap)}>
      <Animated.View>
        <Animated.View style={deleteStyle}>
          <DeleteBackground />
        </Animated.View>
        <Animated.View style={completeStyle}>
          <CompleteBackground />
        </Animated.View>
        <Animated.View style={animStyle}>
          <Pressable
            onPress={() => onPress?.(todo)}
            style={({ pressed }) => [
              styles.container,
              { backgroundColor: dark ? '#1e1e1e' : '#fff' },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={[styles.title, {
              color: dark ? '#fff' : '#222',
              textDecorationLine: todo.completed ? 'line-through' : 'none',
              opacity: todo.completed ? 0.5 : 1,
            }]}>
              {todo.title}
            </Text>
            <Text style={styles.priority}>{todo.priority}</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 14, borderRadius: 12,
  },
  title: { fontSize: 16, flex: 1 },
  priority: { fontSize: 12, color: '#6C63FF', marginLeft: 8 },
});