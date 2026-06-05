import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Spinner, Text, View, XStack } from "tamagui";
import { api } from "@/lib/api";
import { getUserId } from "@/lib/auth-client";
import { runJoinActivityFlow } from "@/features/experience/experience.service";
import { useToast } from "../../context/toast-context";
import { INBOX_QUERY_KEY } from "../../features/chat/inbox/hooks/use-inbox";
import { ActivityDetails } from "@/features/experience/schemas/activity-details.schema";

export function ActionBar({ activity }: { activity?: ActivityDetails }) {
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

    try {
      setLoading(true);
      const outcome = await runJoinActivityFlow({
        activity,
        hasJoined,
        joinRequest: async (activityId) => {
          await api.post(`/activities/${activityId}/join`);
        },
      });

      if (outcome.type === "noop") {
        return;
      }

      if (outcome.type === "open-chat") {
        router.push(`/chat/${outcome.chatId}`);
        return;
      }

      if (outcome.type === "error") {
        showToast(outcome.message, "error");
        return;
      }

      if (outcome.shouldInvalidateInbox) {
        await queryClient.invalidateQueries({ queryKey: INBOX_QUERY_KEY });
      }

      showToast(outcome.successMessage, "success");

      setTimeout(() => {
        router.replace(outcome.redirectTo);
      }, outcome.redirectDelayMs);
    } catch (error: unknown) {
      console.error("Join error:", error);
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      showToast(message, "error");
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
