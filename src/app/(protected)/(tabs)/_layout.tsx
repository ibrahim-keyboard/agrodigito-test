import { Tabs } from 'expo-router';

import {
  HomeIcon,
  SearchIcon,
  OrderBoxIcon,
  PersonCircleIcon,
} from '@/constants/icons';
import { Colors } from '@/constants/Colors';
import HeaderRightComponent from '@/components/HeaderRightComponent';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary[800],
        tabBarInactiveTintColor: Colors.neutral[500],
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 1,

          borderTopColor: Colors.neutral[200],
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
        },
        // headerShown: false,
      }}>
      <Tabs.Screen
        name='index'
        options={{
          headerShown: false,
          headerShadowVisible: false,
          title: 'Agrodigito',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: '700',
            color: Colors.neutral[900],

            fontFamily: 'Inter-Bold',
          },
          tabBarIcon: ({ color }) => <HomeIcon height={24} fill={color} />,
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          headerShadowVisible: false,

          title: 'Search',
          tabBarIcon: ({ color }) => <SearchIcon height={24} fill={color} />,
          headerRight: () => <HeaderRightComponent />,
        }}
      />
      <Tabs.Screen
        name='order'
        options={{
          headerShadowVisible: false,

          title: 'My Orders',
          headerRight: () => <HeaderRightComponent />,

          tabBarIcon: ({ color }) => <OrderBoxIcon height={24} fill={color} />,
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <PersonCircleIcon height={24} fill={color} />
          ),
        }}
      />
    </Tabs>
  );
}
