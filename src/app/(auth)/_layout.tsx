import { Stack } from 'expo-router';
import { SystemBars } from 'react-native-edge-to-edge';

export default function AuthLayout() {
  return (
    <>
      <SystemBars style='light' />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='onboading' options={{ headerShown: false }} />
        <Stack.Screen name='login' />
        <Stack.Screen name='user-profile' />
        <Stack.Screen name='shop-info' />
        <Stack.Screen name='phone-number' />
        <Stack.Screen name='callback' />
      </Stack>
    </>
  );
}
