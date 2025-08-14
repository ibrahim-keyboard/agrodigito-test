import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing'
  );

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processing auth callback...');

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          console.log('✅ Session set successfully for:', user.email);
          setStatus('success');

          // Small delay to show success state, then redirect
          setTimeout(() => {
            router.replace('/(protected)/(tabs)');
          }, 1000);
          return;
        }

        // If we get here, check if there's already a session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          console.log('✅ Existing session found for:', session.user.email);
          setStatus('success');
          setTimeout(() => {
            router.replace('/(protected)/(tabs)');
          }, 1000);
          return;
        }

        // If no auth data found, redirect to auth screen
        console.log('❌ No authentication data found');
        setStatus('error');
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 2000);
      } catch (error) {
        console.error('❌ Auth callback processing error:', error);
        setStatus('error');
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [router]);

  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return 'Processing sign in...';
      case 'success':
        return 'Sign in successful! Redirecting...';
      case 'error':
        return 'Authentication failed. Redirecting...';
      default:
        return 'Processing...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return Colors.success[500];
      case 'error':
        return Colors.error[500];
      default:
        return Colors.primary[700];
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={getStatusColor()} />
      <Text style={[styles.text, { color: getStatusColor() }]}>
        {getStatusMessage()}
      </Text>
      {status === 'success' && (
        <Text style={styles.subText}>Welcome! Taking you to the app...</Text>
      )}
      {status === 'error' && (
        <Text style={styles.subText}>Please try signing in again.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 32,
  },
  text: {
    ...Typography.h5,
    marginTop: 24,
    textAlign: 'center',
  },
  subText: {
    ...Typography.body,
    color: Colors.neutral[600],
    marginTop: 8,
    textAlign: 'center',
  },
});
