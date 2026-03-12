import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

const THUMB = 100;

interface Props {
  image: string;
  onRemove: (uri: string) => void;
}

/** Individual item photo
 * @param image - uri 
 * @param onRemove - To remove photos 
 * 
 */
export const ImageCardItem = ({ image, onRemove }: Props) => {
  return (
    <View style={styles.imageCard}>
      <Pressable
        onPress={() => onRemove(image)}
        style={styles.closeButton}
      >
        <Ionicons name="close" size={30} color="white" />
      </Pressable>

      <Animated.Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
    </View>
  );
};

const styles = StyleSheet.create({
  imageCard: {
    width: THUMB,
    height: THUMB,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    zIndex: 1000,
    left: '70%',
  },
});