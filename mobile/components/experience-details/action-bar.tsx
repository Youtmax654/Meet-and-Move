import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Spinner, Text, View, XStack } from "tamagui";
import { useDevUser } from "../../context/dev-user-context";
import { useToast } from "../../context/toast-context";
import { Activity } from "../../types/activity";

export function ActionBar({ activity }: { activity?: Activity }) {
  const router = useRouter();
  const { activeUser } = useDevUser();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!activity) return;

    if (!activeUser) {
      showToast("Sélectionne d'abord un utilisateur dans le menu de debug (icône bug) !", "error");
      return;
    }

    try {
      setLoading(true);
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787";

      const response = await fetch(`${apiUrl}/activities/${activity.id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: activeUser.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      showToast(`Bravo ! Tu as rejoint l'activité "${activity.title}"`, "success");

      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1500);

    } catch (error: any) {
      console.error("Join error:", error);
      showToast(error.message, "error");
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
          onPress={handleJoin}
          disabled={loading}
          pressStyle={{ scale: 0.98, opacity: 0.9 }}
        >
          {loading ? (
            <Spinner color="white" />
          ) : (
            <Text color="#FFFFFF" fontWeight="700" fontSize={16}>
              Rejoindre l'Équipe
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
