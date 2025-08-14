import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { CallCallingIcon, CartIcon, TruckIcon } from '@/constants/icons';

import GoogleSigninButton from '@/components/GoogleSigninButton';

export default function AuthScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name='arrow-back' color={Colors.neutral[800]} size={24} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Join Agrodigito</Text>
          <Text style={styles.description}>
            Stock from trusted suppliers and manufacturers to grow your Agrovet
            business today
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <CartIcon height={24} fill={Colors.primary[700]} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Shop Quality Products</Text>
              <Text style={styles.featureDescription}>
                Access thousands of quality agricultural supplies
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <TruckIcon height={24} fill={Colors.primary[700]} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Fast Delivery</Text>
              <Text style={styles.featureDescription}>
                Get your orders delivered quickly to your farm
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <CallCallingIcon height={24} fill={Colors.primary[700]} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Expert Support</Text>
              <Text style={styles.featureDescription}>
                Get advice from agricultural experts
              </Text>
            </View>
          </View>
        </View>

        <GoogleSigninButton />

        <View style={styles.footer}>
          <Link href='/(auth)/privacy' style={styles.terms}>
            By continuing, you agree to our{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary[900],
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 150,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    ...Typography.h1,
    lineHeight: 50,
    color: Colors.white,
    fontSize: 40,

    marginBottom: 16,
  },

  description: {
    ...Typography.body,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },

  features: {
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...Typography.h6,
    color: Colors.white,
    marginBottom: 4,
  },
  featureDescription: {
    ...Typography.bodySmall,
    color: Colors.white,
    opacity: 0.9,
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 48 : 24,
    left: 24,
    right: 24,
  },
  terms: {
    ...Typography.caption,
    textAlign: 'center',
    color: Colors.white,
    opacity: 0.8,
  },
  link: {
    textDecorationLine: 'underline',
  },
});
