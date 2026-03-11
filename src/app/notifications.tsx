import { lazy, Suspense } from 'react';
import { Text } from 'react-native';

const NotificationsScreen = lazy(() => import('../screen/notifcation-screen'));

export default function NotificationsPage() {
  return (
    <Suspense fallback={<Text>Cargando...</Text>}>
      <NotificationsScreen />
    </Suspense>
  );
}