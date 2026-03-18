
import migrations from '@migrations/migrations';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { ToastProvider } from '@src/components/ui/Toast';
import { db } from '@src/db/client';
import { useMediaLibraryPermission } from '@src/hooks/useMediaLibraryPermission';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import HomeScreen from '../screen/home-screen';

export default function RootLayout() {
  const { success, error: ORMError } = useMigrations(db, migrations);

  //Enables use file system
  useMediaLibraryPermission()

  //To load fonts
  SplashScreen.preventAutoHideAsync();

  //Fonts configuration
  const [loaded, error] = useFonts({
    'JetBrainsMono-Bold': require('../assets/fonts/JetBrainsMono-Bold.ttf'),
    'JetBrainsMono-ExtraBold': require('../assets/fonts/JetBrainsMono-ExtraBold.ttf'),
    'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
  });

  useEffect(() => {
    if (success || ORMError) {
      SplashScreen.hideAsync();
    }
  }, [success, ORMError]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);


  if (ORMError) {
    return <View><Text>Error: {ORMError.message}</Text></View>;
  }

  if (!success) {
    return null;
  }

  return (

    <ThemeProvider value={DarkTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>{/* Necesary to use gestures in toast */}
        <ToastProvider>
          <HomeScreen />
          <StatusBar style="auto" />
        </ToastProvider>
      </GestureHandlerRootView>

    </ThemeProvider>
  );
}