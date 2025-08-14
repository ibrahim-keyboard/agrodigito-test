import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '@/store/authStore';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();
export default function ProtectedLayout() {
  const { user, loading, initialized } = useAuth();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }

    if (initialized && !loading && !user?.id) {
      router.replace('/(auth)/onboading');
    }
  }, [user, loading, initialized]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='products/[id]' options={{ headerShown: false }} />
        <Stack.Screen name='cart' options={{ presentation: 'modal' }} />
        <Stack.Screen name='checkout' />
        <Stack.Screen name='profile/addresses' />
        <Stack.Screen name='profile/analytics' />
        <Stack.Screen name='profile/help' />
        <Stack.Screen name='profile/notifications' />
        <Stack.Screen name='profile/payment' />
        <Stack.Screen name='profile/personal' />
        <Stack.Screen name='profile/settings' />
        <Stack.Screen name='success' />
        <Stack.Screen name='orders/[orderId]' />
        <Stack.Screen
          name='track-order/[orderId]'
          options={{ presentation: 'modal' }}
        />
      </Stack>
    </>
  );
}
