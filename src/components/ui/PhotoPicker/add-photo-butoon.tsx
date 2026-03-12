import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

interface Props {
  onPress: () => void;
}

/**
 * Button to add new photos
 * @param onPress function 
 * @returns Component 
 */
export const AddPhotoButton = ({ onPress }: Props) => (
  <Pressable onPress={onPress} style={styles.iconCircle}>
    <MaterialIcons name="add-a-photo" size={26} color="white" />
  </Pressable>
);

const styles = StyleSheet.create({
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#333539',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginLeft: 12,
  },
});