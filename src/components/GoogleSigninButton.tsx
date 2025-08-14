import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { GoogleLogo } from '@/constants/icons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useAuth } from '@/store/authStore';

export default function GoogleSigninButton() {
  const { signInWithGoogle, loading } = useAuth();
  async function handleGoogleSignIn() {
    await signInWithGoogle();
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}>
        {loading ? (
          <View style={styles.loadingContent}>
            <ActivityIndicator color={Colors.neutral[600]} size='small' />
            <Text style={styles.loadingText}>Signing in...</Text>
          </View>
        ) : (
          <View style={styles.content}>
            <GoogleLogo style={styles.googleIcon} />

            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginBottom: 48,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContent: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.button,
    color: Colors.neutral[600],
    fontSize: 18,
    lineHeight: 24,
    textTransform: 'none',
    marginLeft: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  googleButtonText: {
    ...Typography.button,
    width: 'auto',
    color: Colors.neutral[900],
    fontSize: 16,
  },
});
