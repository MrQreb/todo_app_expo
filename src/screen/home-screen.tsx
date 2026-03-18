import { InputActionButton, InputContainer, InputField } from '@src/components/ui/Input';
import PhotoPicker from '@src/components/ui/PhotoPicker/photo-picker';
import { SelectPriority } from '@src/components/ui/SelectPriority/select-priority';
import { FilterStatus, SelectStatus } from '@src/components/ui/SelectStatus/select-status';
import { toast } from '@src/components/ui/Toast';
import { TodoDetailModal } from '@src/components/ui/TodoList/EditModal/todo-detail-modal';
import { TodoList } from '@src/components/ui/TodoList/todo-list';
import { db } from '@src/db/client';
import { photos, Priority, Todo, todos, TodoWithPhotos } from '@src/db/schema';
import { todoQueries } from '@src/queries/todoQueries';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';

  const [text, setText] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    console.log(images)
  }, [images])

  const [filter, setFilter] = useState<FilterStatus>('all');
  const [priority, setPriority] = useState<Priority>('medium');
  const [selectedTodo, setSelectedTodo] = useState<TodoWithPhotos | null>(null);


  const QUERY_MAP = {
    all: todoQueries.getAll(),
    completed: todoQueries.getCompleted(true),
    pending: todoQueries.getCompleted(false),
  };

  const { data: filteredList } = useLiveQuery(QUERY_MAP[filter], [filter]);


  console.log(filteredList)
  console.log(typeof (filteredList))
  console.log(typeof (filteredList))


  const addTodo = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // 1. Inserta el todo y obtén su id
    const result = await db
      .insert(todos)
      .values({ title: trimmed, priority })
      .returning({ id: todos.id });

    const todoId = result[0].id;

    // 2. Inserta cada imagen relacionada al todo
    if (images.length > 0) {
      await db.insert(photos).values(
        images.map(uri => ({ uri, todoId }))
      );
    }

    setText('');
    setImages([]);
    toast.success('Tarea agregada');

    const last = await todoQueries.getLastWithPhotos();
    console.log('Último todo con fotos:', JSON.stringify(last, null, 2));


  };

  const deleteTodo = async (todo: Todo) => {
    try {
      await db.delete(todos).where(eq(todos.id, todo.id));
      toast.warning(`Tarea eliminada`);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const completeTodo = async (todo: Todo) => {
    try {
      await db.update(todos)
        .set({ completed: !todo.completed })
        .where(eq(todos.id, todo.id));
      toast.success(`Tarea completada`);
    } catch (error) {
      console.error('Error al completar:', error);
    }
  };

  const handleFilterPress = (seleted: FilterStatus) => {
    setFilter(prev => prev === seleted ? 'all' : seleted);
  };

  return (
    <SafeAreaView
      style={[styles.container]}
    >

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >


        <SelectPriority selected={priority} onSelect={setPriority} />

        <SelectStatus
          activeFilter={filter}
          onPressAll={() => setFilter('all')}
          onPressCompleted={() => handleFilterPress('completed')}
          onPressInNotCompleted={() => handleFilterPress('pending')}
        />



        <View style={{ flex: 1 }}>
          <TodoList
            taskList={filteredList}
            onSwipeRight={deleteTodo}
            onSwipeLeft={completeTodo}
            onLongPress={(todo) => setSelectedTodo(todo)}

          />
        </View>

        <PhotoPicker
          images={images}
          maxImages={1}
          setImages={setImages}
          onCancel={() => { }}
        />
        <InputContainer>
          <InputField
            value={text}
            onChangeText={setText}
            onSubmitEditing={addTodo}
            placeholder="Añadir nueva tarea..."
          />
          <InputActionButton onPress={addTodo} />
        </InputContainer>

      </KeyboardAvoidingView>


      <TodoDetailModal
        todo={selectedTodo}
        onClose={() => setSelectedTodo(null)}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'black'
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8
  },
});