import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { ActionSheetIOS, Alert, Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { AddPhotoButton } from './add-photo-butoon';
import { ImageCardItem } from './image-card-item';

interface Props {
  /**Uris array */
  images: string[];

  multiple?: boolean;
  maxImages?: number;
  quality?: number;

  /** [3,4] => Example */
  aspect?: [number, number];
  setImages: (uris: string[]) => void;

  onCancel: () => void;
  fullWidth?: boolean;
  allowEditing?: boolean;
}

export default function PhotoPicker({
  images = [],
  multiple = false,
  maxImages = 10,
  quality = 1,
  aspect,
  setImages,
  onCancel,
  fullWidth = true,
  allowEditing = false
}: Props) {

  const handleRemovePhoto = (uri: string) => {
    const updated = images.filter(image => image !== uri);
    setImages(updated);
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect,
      quality,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const next = multiple ? [...images, uri] : [uri];
      // setImages(next);
      setImages(next);
    } else {
      onCancel();
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: multiple,
      selectionLimit: multiple ? maxImages - images.length : 1,
      allowsEditing: allowEditing,
      aspect,
      quality,
    });

    if (!result.canceled) {
      const uris = result.assets.map(a => a.uri);
      const next = multiple ? [...images, ...uris].slice(0, maxImages) : [uris[0]];
      // setImages(next);
      setImages(next);
    } else {
      onCancel();
    }
  };

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Tomar foto', 'Seleccionar de galería'],
          cancelButtonIndex: 0,
        },
        (index) => {
          if (index === 1) openCamera();
          if (index === 2) openGallery();
        }
      );
    } else {
      Alert.alert('Seleccionar imagen', '¿De dónde quieres obtener la imagen?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tomar foto', onPress: openCamera },
        { text: 'Galería', onPress: openGallery },
      ]);
    }
  };

  /**Button to add photo */
  if (images.length === 0) return <AddPhotoButton onPress={handlePress} />;

  return (
    
    <View style={styles.container}>

      {!multiple && (
        <Pressable onPress={handlePress}>
          <View style={[styles.imageCard, fullWidth && styles.imageCardFull]}>
            <Image source={{ uri: images[0] }} style={styles.image} resizeMode="cover" />
          </View>
        </Pressable>
      )}

      {multiple && (
        <View style={styles.grid}>
          {images.map((uri) => (
            <ImageCardItem
              key={uri}
              image={uri}
              onRemove={handleRemovePhoto}
            />
          ))}
          {images.length < maxImages && (
            <Pressable onPress={handlePress} style={styles.addMore}>
              <MaterialIcons name="add" size={28} color="#888" />
            </Pressable>
          )}
        </View>
      )}

    </View>
  );
}

const THUMB = 100;

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
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
  addMore: {
    width: THUMB,
    height: THUMB,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCardFull: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },
});