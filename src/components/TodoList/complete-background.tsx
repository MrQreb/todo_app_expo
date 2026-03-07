import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export const CompleteBackground = () => (
  <View style={styles.container}>
    <View style={styles.content}>
      <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
      <Text style={styles.text}>Completar</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    borderRadius: 12, overflow: 'hidden',
    backgroundColor: '#34C759',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingRight: 20,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
});