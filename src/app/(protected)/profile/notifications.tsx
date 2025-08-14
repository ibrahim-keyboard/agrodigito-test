import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Card from '@/components/Card';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  category: 'orders' | 'promotions' | 'account';
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'order_updates',
      title: 'Order Updates',
      description:
        'Get notified about order status changes and delivery updates',
      icon: (
        <MaterialCommunityIcons
          name='package-variant'
          size={20}
          color={Colors.primary[700]}
        />
      ),
      enabled: true,
      category: 'orders',
    },
    {
      id: 'order_shipped',
      title: 'Order Shipped',
      description: 'Receive notifications when your orders are shipped',
      icon: <Feather name='truck' size={20} color={Colors.accent[500]} />,
      enabled: true,
      category: 'orders',
    },
    {
      id: 'order_delivered',
      title: 'Order Delivered',
      description: 'Get notified when your orders are delivered',
      icon: (
        <Ionicons
          name='notifications-outline'
          size={20}
          color={Colors.success[500]}
        />
      ),
      enabled: true,
      category: 'orders',
    },
    {
      id: 'cart_reminders',
      title: 'Cart Reminders',
      description: 'Reminders about items left in your cart',
      icon: (
        <MaterialCommunityIcons
          name='cart-outline'
          size={20}
          color={Colors.warning[500]}
        />
      ),
      enabled: false,
      category: 'orders',
    },
    {
      id: 'price_drops',
      title: 'Price Drops',
      description: 'Get notified when prices drop on your favorite products',
      icon: (
        <FontAwesome5 name='dollar-sign' size={20} color={Colors.error[500]} />
      ),
      enabled: true,
      category: 'promotions',
    },
    {
      id: 'new_products',
      title: 'New Products',
      description: 'Be the first to know about new product arrivals',
      icon: (
        <MaterialCommunityIcons
          name='bullhorn-outline'
          size={20}
          color={Colors.secondary[600]}
        />
      ),
      enabled: false,
      category: 'promotions',
    },
    {
      id: 'special_offers',
      title: 'Special Offers',
      description: 'Receive notifications about exclusive deals and promotions',
      icon: (
        <MaterialCommunityIcons
          name='bullhorn-outline'
          size={20}
          color={Colors.primary[700]}
        />
      ),
      enabled: true,
      category: 'promotions',
    },
    {
      id: 'account_security',
      title: 'Account Security',
      description: 'Important security updates and login alerts',
      icon: (
        <Ionicons
          name='notifications-outline'
          size={20}
          color={Colors.error[500]}
        />
      ),
      enabled: true,
      category: 'account',
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const renderNotificationSetting = (setting: NotificationSetting) => (
    <View key={setting.id} style={styles.settingItem}>
      <View style={styles.settingContent}>
        <View style={styles.settingIcon}>{setting.icon}</View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{setting.title}</Text>
          <Text style={styles.settingDescription}>{setting.description}</Text>
        </View>
      </View>
      <Switch
        value={setting.enabled}
        onValueChange={() => toggleSetting(setting.id)}
        trackColor={{
          false: Colors.neutral[300],
          true: Colors.primary[200],
        }}
        thumbColor={setting.enabled ? Colors.primary[700] : Colors.neutral[500]}
      />
    </View>
  );

  const renderSection = (title: string, category: string) => {
    const categorySettings = settings.filter(
      (setting) => setting.category === category
    );

    return (
      <Card key={category} style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.settingsList}>
          {categorySettings.map(renderNotificationSetting)}
        </View>
      </Card>
    );
  };

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
          <Text style={styles.title}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerDescription}>
              Manage your notification preferences to stay updated on what
              matters most to you.
            </Text>
          </View>

          {renderSection('Order Notifications', 'orders')}
          {renderSection('Promotions & Updates', 'promotions')}
          {renderSection('Account & Security', 'account')}

          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons
                name='notifications-outline'
                size={24}
                color={Colors.primary[700]}
              />
              <Text style={styles.infoTitle}>Push Notifications</Text>
            </View>
            <Text style={styles.infoText}>
              To receive push notifications, make sure notifications are enabled
              for Agrodigito in your device settings.
            </Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Text style={styles.settingsButtonText}>
                Open Device Settings
              </Text>
            </TouchableOpacity>
          </Card>

          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Notification Summary</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {settings.filter((s) => s.enabled).length}
                </Text>
                <Text style={styles.summaryLabel}>Enabled</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {settings.filter((s) => !s.enabled).length}
                </Text>
                <Text style={styles.summaryLabel}>Disabled</Text>
              </View>
            </View>
          </Card>
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
  headerInfo: {
    marginBottom: 24,
  },
  headerDescription: {
    ...Typography.body,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionCard: {
    marginBottom: 24,
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
  infoCard: {
    marginBottom: 24,
    backgroundColor: Colors.primary[50],
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    ...Typography.h5,
    marginLeft: 12,
    color: Colors.primary[900],
  },
  infoText: {
    ...Typography.body,
    color: Colors.primary[800],
    lineHeight: 22,
    marginBottom: 16,
  },
  settingsButton: {
    backgroundColor: Colors.primary[700],
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  settingsButtonText: {
    ...Typography.button,
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: Colors.neutral[100],
  },
  summaryTitle: {
    ...Typography.h5,
    textAlign: 'center',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  summaryNumber: {
    ...Typography.h2,
    color: Colors.primary[700],
    marginBottom: 4,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.neutral[600],
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.neutral[300],
  },
});
