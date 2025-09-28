import { Tabs } from 'expo-router';
import React from 'react';


import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function TabContent({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={{ flex: 1, display: isActive ? 'flex' : 'none' }}
    >
      {children}
    </Animated.View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();



  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="RXv2"
        options={{
          title: 'RX',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="pill.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tray.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Insurance"
        options={{
          title: 'Insurance',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Agents"
        options={{
          title: 'Agents',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="app.badge" color={color} />,
        }}
      />
    </Tabs>
  );
}
