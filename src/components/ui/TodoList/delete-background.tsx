import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export const DeleteBackground = () => (
  <View style={styles.container}>
    <View style={styles.content}>
      <Ionicons name="trash-outline" size={20} color="#fff" />
      <Text style={styles.text}>Eliminar</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    borderRadius: 12, overflow: 'hidden',
    backgroundColor: '#FF3B30',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 20,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
});