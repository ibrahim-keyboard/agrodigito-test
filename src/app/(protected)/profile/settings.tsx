import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Card from '@/components/Card';

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    darkMode: false,
    offlineMode: true,
    autoSync: true,
    biometricAuth: false,
    showPrices: true,
    notifications: true,
    analytics: false,
  });

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and may slow down the app temporarily. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Implement cache clearing logic
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement account deletion logic
            router.replace('/(onboarding)');
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    title: string,
    description: string,
    icon: React.ReactNode,
    value?: boolean,
    onToggle?: () => void,
    onPress?: () => void,
    showArrow?: boolean
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress && !onToggle}
      activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.settingContent}>
        <View style={styles.settingIcon}>{icon}</View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <View style={styles.settingAction}>
        {onToggle && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{
              false: Colors.neutral[300],
              true: Colors.primary[200],
            }}
            thumbColor={value ? Colors.primary[700] : Colors.neutral[500]}
          />
        )}
        {showArrow && (
          <AntDesign name='right' size={20} color={Colors.neutral[400]} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <AntDesign name='arrowleft' size={24} color={Colors.neutral[800]} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <View style={styles.settingsList}>
              {renderSettingItem(
                'Dark Mode',
                'Switch between light and dark themes',
                <Feather name='moon' size={20} color={Colors.neutral[700]} />,
                settings.darkMode,
                () => toggleSetting('darkMode')
              )}
              {renderSettingItem(
                'Language',
                'English (US)',
                <MaterialCommunityIcons
                  name='earth'
                  size={20}
                  color={Colors.neutral[700]}
                />,
                undefined,
                undefined,
                () => router.push('/settings/language'),
                true
              )}
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Data & Storage</Text>
            <View style={styles.settingsList}>
              {renderSettingItem(
                'Offline Mode',
                'Download content for offline viewing',
                <Feather
                  name='download'
                  size={20}
                  color={Colors.neutral[700]}
                />,
                settings.offlineMode,
                () => toggleSetting('offlineMode')
              )}
              {renderSettingItem(
                'Auto Sync',
                'Automatically sync data when connected',
                <MaterialCommunityIcons
                  name='wifi'
                  size={20}
                  color={Colors.neutral[700]}
                />,
                settings.autoSync,
                () => toggleSetting('autoSync')
              )}
              {renderSettingItem(
                'Clear Cache',
                'Free up storage space',
                <MaterialCommunityIcons
                  name='database'
                  size={20}
                  color={Colors.neutral[700]}
                />,
                undefined,
                undefined,
                handleClearCache,
                true
              )}
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Security & Privacy</Text>
            <View style={styles.settingsList}>
              {renderSettingItem(
                'Biometric Authentication',
                'Use fingerprint or face ID to unlock',
                <Feather
                  name='smartphone'
                  size={20}
                  color={Colors.neutral[700]}
                />,
                settings.biometricAuth,
                () => toggleSetting('biometricAuth')
              )}
              {renderSettingItem(
                'Show Prices',
                'Display product prices in listings',
                settings.showPrices ? (
                  <Feather name='eye' size={20} color={Colors.neutral[700]} />
                ) : (
                  <Feather
                    name='eye-off'
                    size={20}
                    color={Colors.neutral[700]}
                  />
                ),
                settings.showPrices,
                () => toggleSetting('showPrices')
              )}
              {renderSettingItem(
                'Privacy Policy',
                'View our privacy policy',
                <Ionicons
                  name='shield-checkmark-outline'
                  size={20}
                  color={Colors.neutral[700]}
                />,
                undefined,
                undefined,
                () => router.push('/legal/privacy'),
                true
              )}
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Analytics</Text>
            <View style={styles.settingsList}>
              {renderSettingItem(
                'Usage Analytics',
                'Help improve the app by sharing usage data',
                <MaterialCommunityIcons
                  name='database'
                  size={20}
                  color={Colors.neutral[700]}
                />,
                settings.analytics,
                () => toggleSetting('analytics')
              )}
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.settingsList}>
              {renderSettingItem(
                'Export Data',
                'Download a copy of your data',
                <Feather
                  name='download'
                  size={20}
                  color={Colors.primary[700]}
                />,
                undefined,
                undefined,
                () =>
                  Alert.alert(
                    'Export Data',
                    'Your data export will be emailed to you within 24 hours.'
                  ),
                true
              )}
            </View>
          </Card>

          <Card style={[styles.sectionCard, styles.dangerCard]}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            <View style={styles.settingsList}>
              {renderSettingItem(
                'Delete Account',
                'Permanently delete your account and all data',
                <Feather name='trash-2' size={20} color={Colors.error[500]} />,
                undefined,
                undefined,
                handleDeleteAccount,
                true
              )}
            </View>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Agrodigito v1.0.0</Text>
            <Text style={styles.footerText}>
              © 2025 Agrodigito. All rights reserved.
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  backButton: {
    padding: 4,
  },
  title: {
    ...Typography.h4,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionCard: {
    marginBottom: 24,
  },
  dangerCard: {
    borderColor: Colors.error[200],
    borderWidth: 1,
  },
  sectionTitle: {
    ...Typography.h5,
    marginBottom: 16,
    color: Colors.neutral[900],
  },
  settingsList: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  settingDescription: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
    lineHeight: 18,
  },
  settingAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.neutral[500],
    textAlign: 'center',
    marginBottom: 4,
  },
});
