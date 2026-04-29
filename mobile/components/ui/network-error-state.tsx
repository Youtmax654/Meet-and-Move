import { useQueryClient } from "@tanstack/react-query";
import { Button, Text, YStack } from "tamagui";

import { IconSymbol } from "./icon-symbol";

type NetworkErrorStateProps = {
  onRetry?: () => void;
  message?: string;
  type?: "offline" | "server";
};

export function NetworkErrorState({
  onRetry,
  message = "Un problème est survenu avec le serveur.",
  type = "server",
}: NetworkErrorStateProps) {
  const queryClient = useQueryClient();
  const isOffline = type === "offline";

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding={24}
      gap={16}
      marginTop={40}
    >
      <IconSymbol
        name={isOffline ? "wifi.slash" : "exclamationmark.triangle"}
        size={48}
        color={isOffline ? "#A0AEC0" : "#F56565"}
      />

      <YStack alignItems="center" gap={8} marginTop={8}>
        <Text fontSize={20} fontWeight="700" color="#1E2228">
          {isOffline ? "Plus de connexion" : "Problème serveur"}
        </Text>
        <Text
          fontSize={15}
          color="#4A5568"
          textAlign="center"
          paddingHorizontal={20}
        >
          {isOffline
            ? "Vérifiez votre connexion internet et réessayez."
            : message}
        </Text>
      </YStack>

      <Button
        marginTop={16}
        backgroundColor="#008A87"
        color="white"
        fontWeight="600"
        onPress={() => {
          queryClient.resetQueries();
          if (onRetry) onRetry();
        }}
        pressStyle={{ opacity: 0.8 }}
      >
        Réessayer
      </Button>
    </YStack>
  );
}
