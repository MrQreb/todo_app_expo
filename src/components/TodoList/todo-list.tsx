import { Todo } from '@/src/db/schema';
import { useState } from 'react';
import { ScrollView, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TodoDetailModal } from './todo-detail-modal';
import { TodoItem } from './todo-item';

type Props = {
  taskList: Todo[] | undefined;
  onPress?: (todo: Todo) => void;
  onSwipeRight?: (todo: Todo) => void;
  onSwipeLeft?: (todo: Todo) => void;
};

export const TodoList = ({ taskList, onPress, onSwipeRight, onSwipeLeft }: Props) => {
  const dark = useColorScheme() === 'dark';
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {taskList?.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            dark={dark}
            onPress={onPress}
            onSwipeRight={onSwipeRight}
            onSwipeLeft={onSwipeLeft}
            onDoubleTap={setSelectedTodo}
          />
        ))}
      </ScrollView>

      <TodoDetailModal
        todo={selectedTodo}
        onClose={() => setSelectedTodo(null)}
      />
    </GestureHandlerRootView>
  );
};