import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import {
  AnalyticIcon,
  CartIcon,
  HelpIcon,
  LocationIcon,
  LogOutIcon,
  NotificationIcon,
  OrderBoxIcon,
  PersonCardIcon,
  SettingsIcon,
} from '@/constants/icons';
import { useAuth } from '@/store/authStore';
import { Image } from 'expo-image';
import LoadingState from '@/components/common/LoadingState';
import { router } from 'expo-router';
import { useState } from 'react';
import CustomAlert from '@/components/CustomAlert';
import { useUserProfile } from '@/hooks/useUserProfile';

const menuItems = [
  {
    title: 'Account',
    items: [
      {
        icon: <PersonCardIcon height={20} fill={Colors.neutral[700]} />,
        label: 'Personal Information',
        route: '/profile/personal',
      },
      {
        icon: <LocationIcon height={20} fill={Colors.neutral[700]} />,
        label: 'My Addresses',
        route: '/profile/addresses',
      },
    ],
  },
  {
    title: 'Activities',
    items: [
      {
        icon: <OrderBoxIcon height={20} fill={Colors.neutral[700]} />,
        label: 'Order History',
        route: '/orders',
      },
      {
        icon: <CartIcon height={20} fill={Colors.neutral[700]} />,
        label: 'My Cart',
        route: '/cart',
      },
      {
        icon: <AnalyticIcon height={20} fill={Colors.neutral[700]} />,
        label: 'Purchase Analytics',
        route: '/profile/analytics',
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      {
        icon: <NotificationIcon height={20} fill={Colors.neutral[700]} />,
        label: 'Notifications',
        route: '/profile/notifications',
      },
      {
        icon: <SettingsIcon height={20} fill={Colors.neutral[700]} />,
        label: 'Settings',
        route: '/profile/settings',
      },
      {
        icon: <HelpIcon height={20} fill={Colors.neutral[700]} />,
        label: 'Help & Support',
        route: '/profile/help',
      },
    ],
  },
];

const ProfileScreen = () => {
  const { signOut, loading } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    cancelText: 'Cancel',
    confirmText: 'OK',
    onConfirm: () => {},
    showCancel: true,
  });

  const showAlert = (config: {
    title: string;
    message: string;
    cancelText?: string;
    confirmText?: string;
    onConfirm: () => void;
    showCancel?: boolean;
  }) => {
    setAlertConfig({
      visible: true,
      title: config.title,
      message: config.message,
      cancelText: config.cancelText || 'Cancel',
      confirmText: config.confirmText || 'OK',
      onConfirm: config.onConfirm,
      showCancel: config.showCancel !== false,
    });
  };

  if (loading || profileLoading) {
    return (
      <SafeAreaView>
        <LoadingState name='profile...' />
      </SafeAreaView>
    );
  }

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  function handleSignout() {
    showAlert({
      title: 'Sign out',
      message: 'Are you sure you want to sign out?',
      confirmText: 'Sign out',
      onConfirm: () => {
        hideAlert();
        signOut();
      },
      showCancel: true,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={{
                uri: userProfile?.profile_image_url,
              }}
              style={styles.avatar}
            />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{userProfile?.full_name}</Text>

              <Text style={styles.profilePhone}>+{userProfile?.phone}</Text>
            </View>
          </View>
        </View>

        {menuItems.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <Pressable
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex < section.items.length - 1 &&
                      styles.menuItemBorder,
                  ]}
                  onPress={() => router.push(item.route)}>
                  <View style={styles.menuItemContent}>
                    <View style={styles.menuItemIcon}>{item.icon}</View>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                  </View>
                  <Ionicons
                    name='chevron-forward'
                    size={20}
                    color={Colors.neutral[400]}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <Pressable style={styles.logoutButton} onPress={handleSignout}>
          <LogOutIcon height={20} fill={Colors.error[700]} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.versionText}>Version 1.0.0-preview--2</Text>
      </ScrollView>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        cancelText={alertConfig.cancelText}
        confirmText={alertConfig.confirmText}
        onCancel={hideAlert}
        onConfirm={alertConfig.onConfirm}
        showCancel={alertConfig.showCancel}
        confirmButtonStyle={{ backgroundColor: Colors.error[700] }}
        cancelButtonStyle={{ backgroundColor: Colors.neutral[100] }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
    backgroundColor: Colors.error[50],
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error[700],
  },
  versionText: {
    fontSize: 12,
    color: Colors.neutral[500],
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
});

export default ProfileScreen;
