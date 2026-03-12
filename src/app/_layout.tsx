
import migrations from '@migrations/migrations';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { ToastProvider } from '@src/components/ui/Toast';
import { db } from '@src/db/client';
import { useMediaLibraryPermission } from '@src/hooks/useMediaLibraryPermission';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function RootLayout() {
  const { success, error, } = useMigrations(db, migrations);

  //Enables use file system
  useMediaLibraryPermission()


  if (error) {
    return <View><Text>Error: {error.message}</Text></View>;
  }

  if (!success) {
    return <View><Text>Cargando...</Text></View>;
  }

  return (

    <ThemeProvider value={DarkTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>{/* Necesary to use gestures in toast */}
        <ToastProvider>
          <Drawer
            screenOptions={{
              drawerStyle: {
                backgroundColor: '#1C1C1E',
              },
              headerStyle: {
                backgroundColor: '#141414',
              },
              headerShadowVisible: false,
              drawerActiveTintColor: '#F2F2F7',
              drawerInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: 'Tareas',
                title: '',
                headerStyle: {
                  backgroundColor: '#030000',
                },
              }}

            />
          </Drawer>
          <StatusBar style="auto" />
        </ToastProvider>
      </GestureHandlerRootView>

    </ThemeProvider>
  );
}