import { Stack } from 'expo-router';

import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '../global.css';
import { StatusBar } from 'react-native';
import { Colors } from '@/constants/Colors';

const queryClient = new QueryClient({
  // queryCache:
});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen
      SplashScreen.hideAsync();
      setAppIsReady(true);
    }
  }, [fontsLoaded, fontError]);

  if (!appIsReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen
          name='(protected)'
          options={{ headerShown: false, animation: 'none' }}
        />
        <Stack.Screen
          name='(auth)'
          options={{ headerShown: false, animation: 'none' }}
        />
      </Stack>
      <StatusBar
        barStyle='light-content'
        backgroundColor={Colors.primary[900]}
      />
    </QueryClientProvider>
  );
}
