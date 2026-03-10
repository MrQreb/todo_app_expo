import { db } from '@/src/db/client';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import migrations from '../../drizzle/migrations';
import { ToastProvider } from '../components/ui/Toast/index';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return <View><Text>Error: {error.message}</Text></View>;
  }

  if (!success) {
    return <View><Text>Cargando...</Text></View>;
  }

  return (

    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ToastProvider>
          <Drawer
          >
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: 'Tareas',
                title: '',
              }}

            />
          </Drawer>
          <StatusBar style="auto" />
        </ToastProvider>
      </GestureHandlerRootView>

    </ThemeProvider>
  );
}