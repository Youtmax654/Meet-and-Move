import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";

import { ProfileScreenContent } from "@/features/profile/components/ProfileScreenContent";
import { getUserId } from "@/lib/api";

export default function ProfilScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const id = await getUserId();
      setUserId(id);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }}>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color="#006666" />
        </YStack>
      </SafeAreaView>
    );
  }

  if (!userId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }}>
        <YStack flex={1} alignItems="center" justifyContent="center" px={20}>
          <Text fontSize={16} color="#2E2F2F" textAlign="center">
            Aucun utilisateur connecté.
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileScreenContent userId={userId} isOwnProfile />
    </>
  );
}
