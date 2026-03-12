import ImagePickerExample from '@src/screen/image-picker-screen';
import { Suspense } from 'react';
import { Text } from 'react-native';


export default function PhotoScreen() {
  return (
    <Suspense fallback={<Text>Cargando...</Text>}>
      <ImagePickerExample />
    </Suspense>
  );
}