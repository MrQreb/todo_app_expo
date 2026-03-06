import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dark ? '#111' : '#f5f5f5' }]}>
      <ScrollView>
        <Text style={[styles.title, { color: dark ? '#fff' : '#222' }]}>Mis Tareas</Text>
      </ScrollView>

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
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    margin: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6C63FF',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: 'bold',
  },
});