import * as ImagePicker from 'expo-image-picker';
import { useEffect } from 'react';

/**
 * Hook necesary to use files
 */
export function useMediaLibraryPermission() {
  useEffect(() => {
    ImagePicker.requestMediaLibraryPermissionsAsync();
  }, []);
}