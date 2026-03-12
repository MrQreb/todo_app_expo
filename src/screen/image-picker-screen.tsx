import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActionSheetIOS, Alert, Image, Platform, Pressable, StyleSheet, View } from 'react-native';

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      // ✅ iOS: ActionSheet nativo
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
      // ✅ Android: Alert como alternativa
      Alert.alert('Seleccionar imagen', '¿De dónde quieres obtener la imagen?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tomar foto', onPress: openCamera },
        { text: 'Galería', onPress: openGallery },
      ]);
    }
  };

  return (
    <View>
      <Pressable onPress={handlePress}>
        <MaterialIcons name="add-a-photo" size={24} color="white" />
      </Pressable>
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});