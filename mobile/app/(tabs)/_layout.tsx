import { TabBar } from "@/components/ui/TabBar";
import { Tabs } from "expo-router";
import React from "react";

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
          title: "Explorer",
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: "activities",
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Messages",
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
        }}
      />
    </Tabs>
  );
}
