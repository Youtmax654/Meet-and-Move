import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";

export function ProfileLoadingState() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }}>
      <YStack flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color="#006666" />
      </YStack>
    </SafeAreaView>
  );
}

export function ProfileErrorState() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }}>
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        px={24}
        gap={8}
      >
        <Text fontSize={18} color="#1E2228" fontWeight="700">
          Profil indisponible
        </Text>
        <Text fontSize={14} color="#5B5C5B" textAlign="center">
          Impossible de charger ce profil pour le moment.
        </Text>
      </YStack>
    </SafeAreaView>
  );
}

export function ProfileNoUserState() {
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
