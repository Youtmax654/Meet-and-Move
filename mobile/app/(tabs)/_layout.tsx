import { Tabs } from 'expo-router';
import React from 'react';
import { TabBar } from '@/components/ui/TabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorer',
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'activities',
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
        }}
      />
    </Tabs>
  );
}
