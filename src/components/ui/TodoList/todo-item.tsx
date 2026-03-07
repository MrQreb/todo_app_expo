import { Todo } from '@/src/db/schema';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
  onLongPress?: (todo: Todo) => void;
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

export const TodoItem = ({ todo, dark, onPress, onSwipeRight, onSwipeLeft, onDoubleTap, onLongPress }: Props) => {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .runOnJS(true)
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
            onLongPress={() => onLongPress?.(todo)}
            delayLongPress={400}
            style={({ pressed }) => [
              styles.container,
              { backgroundColor: dark ? '#1e1e1e' : '#fff' },
              pressed && { opacity: 0.7 },
            ]}
          >

            <View style={styles.titleRow}>
              <View style={[styles.priorityBar, { backgroundColor: PRIORITY_COLORS[todo.priority] }]} />
              <Text style={[styles.title, {
                color: dark ? '#fff' : '#222',
                textDecorationLine: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.5 : 1,
              }]}>
                {todo.title}
              </Text>
            </View>


            <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[todo.priority] }]} />


            <Text style={[styles.date, { color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }]}>
              {formatDate(todo.createdAt)}
            </Text>

          </Pressable>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    flex: 1,
  },
  priority: {
    fontSize: 12,
    color: '#6C63FF',
    marginLeft: 8,
  },
  date: {
    fontSize: 11,
    marginLeft: 8,
  },

  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  
  priorityBar: {
    width: 3,
    height: 18,  
    borderRadius: 2,
  },

});