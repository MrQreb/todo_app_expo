import { Priority, Todo, todos } from '@/src/db/schema';
import { Ionicons } from '@expo/vector-icons';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilterStatus, SelectStatus } from '../components/SelectStatus/select-status';
import { TodoDetailModal } from '../components/TodoList/todo-detail-modal';
import { TodoList } from '../components/TodoList/todo-list';
import { SelectPriority } from '../components/ui/select-priority';
import { db } from '../db/client';
import { todoQueries } from '../queries/todoQueries';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';

  const [text, setText] = useState<string>('');

  const [filter, setFilter] = useState<FilterStatus>('all');
  const [priority, setPriority] = useState<Priority>('medium');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);


  const QUERY_MAP = {
    all: todoQueries.getAll(),
    completed: todoQueries.getCompleted(true),
    pending: todoQueries.getCompleted(false),
  };



  const { data: filteredList } = useLiveQuery(QUERY_MAP[filter], [filter]);

  const addTodo = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await db.insert(todos).values({ title: trimmed, priority });
    setText('');
  };

  const deleteTodo = async (todo: Todo) => {
    try {
      await db.delete(todos).where(eq(todos.id, todo.id));
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const completeTodo = async (todo: Todo) => {
    try {
      await db.update(todos)
        .set({ completed: !todo.completed })
        .where(eq(todos.id, todo.id));
    } catch (error) {
      console.error('Error al completar:', error);
    }
  };

  const handleFilterPress = (seleted: FilterStatus) => {
    setFilter(prev => prev === seleted ? 'all' : seleted);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dark ? '#111' : '#f5f5f5' }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.header} onPress={() => console.log('menu')}>
          <Ionicons name="sunny" size={22} color={dark ? '#fff' : '#222'} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: dark ? '#fff' : '#222' }]}>Mis Tareas</Text>

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


        <View style={[styles.inputContainer, {
          backgroundColor: dark ? '#1e1e1e' : '#fff',
          borderTopColor: dark ? '#333' : '#eee',
        }]}>
          <TextInput
            style={[styles.input, {
              backgroundColor: dark ? '#2a2a2a' : '#f0f0f0',
              color: dark ? '#fff' : '#222',
            }]}
            placeholder="Añadir nueva tarea..."
            placeholderTextColor={dark ? '#666' : '#999'}
            value={text}
            onChangeText={setText}
            onSubmitEditing={addTodo}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.button} onPress={addTodo}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>


      <TodoDetailModal                             
        todo={selectedTodo}
        onClose={() => setSelectedTodo(null)}
      />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 30, fontWeight: 'bold', margin: 16 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 10, borderTopWidth: 1,
  },
  input: {
    flex: 1, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 16, fontSize: 16,
  },
  button: {
    backgroundColor: '#6C63FF', width: 48, height: 48,
    borderRadius: 24, alignItems: 'center', justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontSize: 28, lineHeight: 30, fontWeight: 'bold' },
  header: { paddingHorizontal: 16, paddingTop: 8 },
});