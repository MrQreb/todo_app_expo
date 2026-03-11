// // src/hooks/usePhotoPicker.ts
// import * as ImagePicker from 'expo-image-picker';
// import { Alert } from 'react-native';

// export function usePhotoPicker() {
//   const pickFromGallery = async (): Promise<string | null> => {
//     const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!granted) {
//       Alert.alert('Permiso requerido', 'Se necesita acceso a la galería.');
//       return null;
//     }
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['images'],
//       quality: 0.8,
//     });
//     if (result.canceled) return null;
//     return result.assets[0].uri;
//   };

//   const pickFromCamera = async (): Promise<string | null> => {
//     const { granted } = await ImagePicker.requestCameraPermissionsAsync();
//     if (!granted) {
//       Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara.');
//       return null;
//     }
//     const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
//     if (result.canceled) return null;
//     return result.assets[0].uri;
//   };

//   const showOptions = (onUri: (uri: string) => void) => {
//     Alert.alert('Agregar foto', '', [
//       { text: 'Cámara', onPress: async () => { const uri = await pickFromCamera(); if (uri) onUri(uri); } },
//       { text: 'Galería', onPress: async () => { const uri = await pickFromGallery(); if (uri) onUri(uri); } },
//       { text: 'Cancelar', style: 'cancel' },
//     ]);
//   };

//   return { showOptions };
// }