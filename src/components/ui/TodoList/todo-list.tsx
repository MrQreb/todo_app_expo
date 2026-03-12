import { TodoWithPhotos } from '@src/db/schema';
import { FlatList, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TodoItem } from './todo-item';

type Props = {
  taskList: TodoWithPhotos[] | undefined;
  onPress?: (todo: TodoWithPhotos) => void;
  onSwipeRight?: (todo: TodoWithPhotos) => void;
  onSwipeLeft?: (todo: TodoWithPhotos) => void;
  onLongPress?: (todo: TodoWithPhotos) => void;
};

export const TodoList = ({ taskList, onPress, onSwipeRight, onSwipeLeft, onLongPress }: Props) => {
  const dark = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlatList
        data={taskList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            dark={dark}
            onPress={onPress}
            onSwipeRight={onSwipeRight}
            onSwipeLeft={onSwipeLeft}
            onLongPress={onLongPress}
          />
        )}
      />
    </GestureHandlerRootView>
  );
};