import { Todo } from '@/src/db/schema';
import { Modal, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

type Props = {
  todo: Todo | null;
  onClose: () => void;
};

export const TodoDetailModal = ({ todo, onClose }: Props) => {
  const dark = useColorScheme() === 'dark';


  console.log(todo)

  return (
    <Modal
      visible={!!todo}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: dark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.title, { color: dark ? '#fff' : '#222' }]}>
            {todo?.title}
          </Text>
          <Text style={styles.priority}>Prioridad: {todo?.priority}</Text>
          <Text style={[styles.date, { color: dark ? '#aaa' : '#666' }]}>
            Creada: {todo?.createdAt?.toLocaleDateString()}
          </Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  content: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: 'bold' },
  priority: { fontSize: 14, color: '#6C63FF' },
  date: { fontSize: 13 },
  button: {
    backgroundColor: '#6C63FF', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});