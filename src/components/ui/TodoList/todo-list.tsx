import { Todo } from '@/src/db/schema';
import { ScrollView, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TodoItem } from './todo-item';

type Props = {
  taskList: Todo[] | undefined;
  onPress?: (todo: Todo) => void;
  onSwipeRight?: (todo: Todo) => void;
  onSwipeLeft?: (todo: Todo) => void;
  onLongPress?: (todo: Todo) => void;
};

export const TodoList = ({ taskList, onPress, onSwipeRight, onSwipeLeft, onLongPress }: Props) => {
  const dark = useColorScheme() === 'dark';

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
            onLongPress={onLongPress}
          />
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
};