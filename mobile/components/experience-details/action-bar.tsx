import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Spinner, Text, View, XStack } from "tamagui";
import { api, getUserId } from "@/lib/api";
import { useToast } from "../../context/toast-context";
import { INBOX_QUERY_KEY } from "../../features/chat/inbox/hooks/use-inbox";
import type { Activity } from "../../types/activity";

export function ActionBar({ activity }: { activity?: Activity }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserId() {
      const id = await getUserId();
      setCurrentUserId(id);
    }
    loadUserId();
  }, []);

  const hasJoined = Boolean(
    currentUserId &&
    activity?.participants?.some((p) => p.id === currentUserId),
  );

  const handlePress = async () => {
    if (!activity) return;

    if (hasJoined) {
      if (activity.chatId) {
        router.push(`/chat/${activity.chatId}`);
      } else {
        showToast("La discussion n'est pas encore disponible.", "error");
      }
      return;
    }

    try {
      setLoading(true);
      await api.post(`/activities/${activity.id}/join`);
      await queryClient.invalidateQueries({ queryKey: INBOX_QUERY_KEY });
      showToast(
        `Bravo ! Tu as rejoint l'activité "${activity.title}"`,
        "success",
      );

      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1500);
    } catch (error: unknown) {
      console.error("Join error:", error);
      if (error instanceof AxiosError && error.response?.status === 401) {
        showToast(
          "Sélectionne d'abord un utilisateur dans le menu de debug (icône bug) !",
          "error",
        );
      } else {
        const fallbackMessage =
          error instanceof Error ? error.message : "Une erreur est survenue";
        const apiMessage =
          error instanceof AxiosError &&
          typeof error.response?.data === "object" &&
          error.response?.data !== null &&
          "error" in error.response.data &&
          typeof (error.response.data as { error?: unknown }).error === "string"
            ? (error.response.data as { error: string }).error
            : null;

        showToast(apiMessage ?? fallbackMessage, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      backgroundColor="#F7F6F5"
      paddingHorizontal={24}
      paddingTop={16}
      paddingBottom={32}
      shadowColor="#000"
      shadowOpacity={0.05}
      shadowRadius={10}
      borderTopColor="#EAEAEA"
      borderTopWidth={1}
    >
      <XStack gap={16} alignItems="center">
        <Button
          flex={1}
          backgroundColor="#006666"
          borderRadius={9999}
          height={56}
          onPress={handlePress}
          disabled={loading}
          pressStyle={{ scale: 0.98, opacity: 0.9 }}
        >
          {loading ? (
            <Spinner color="white" />
          ) : (
            <Text color="#FFFFFF" fontWeight="700" fontSize={16}>
              {hasJoined ? "Aller vers la discussion" : "Rejoindre l'Équipe"}
            </Text>
          )}
        </Button>
        <Button
          width={56}
          height={56}
          borderRadius={28}
          borderWidth={0}
          backgroundColor="#E2E2E1"
          alignItems="center"
          justifyContent="center"
          padding={0}
          pressStyle={{ scale: 0.98, backgroundColor: "#D1D1D1" }}
        >
          <Ionicons name="heart-outline" size={24} color="#5B5C5B" />
        </Button>
      </XStack>
    </View>
  );
}
