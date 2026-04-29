import { useNetInfo } from "@react-native-community/netinfo";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";
import { NetworkErrorState } from "@/components/ui/network-error-state";

export function ProfileLoadingState() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }}>
      <YStack flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color="#006666" />
      </YStack>
    </SafeAreaView>
  );
}

export function ProfileErrorState({ onRetry }: { onRetry?: () => void }) {
  const netInfo = useNetInfo();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }}>
      <NetworkErrorState 
        message="Impossible de charger ce profil pour le moment."
        type={netInfo.isConnected === false ? "offline" : "server"}
        onRetry={onRetry}
      />
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
