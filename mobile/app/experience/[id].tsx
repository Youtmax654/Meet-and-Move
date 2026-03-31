import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, XStack } from "tamagui";
import { Activity } from "../../types/activity";

import { ActionBar } from "../../components/experience-details/action-bar";
import { ExperienceDescription } from "../../components/experience-details/experience-description";
import { ExperienceHeader } from "../../components/experience-details/experience-header";
import { HeroSection } from "../../components/experience-details/hero-section";
import { PriceBreakdown } from "../../components/experience-details/price-breakdown";
import { SquadMembers } from "../../components/experience-details/squad-members";

export default function ExperienceDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivity() {
      try {
        setLoading(true);
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/activities/${id}`);

        if (response.status === 404) {
          throw new Error("Activité introuvable - 404");
        }

        if (!response.ok) {
          throw new Error("Échec du chargement de l'activité");
        }
        const data = await response.json();
        setActivity(data);
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchActivity();
    }
  }, [id]);

  if (loading) {
    return (
      <View
        flex={1}
        backgroundColor="#F7F6F5"
        justifyContent="center"
        alignItems="center"
      >
        <ActivityIndicator size="large" color="#006666" />
      </View>
    );
  }

  if (error || !activity) {
    return (
      <View
        flex={1}
        backgroundColor="#F7F6F5"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize={48} fontWeight="800" color="#006666" mb={16}>
          404
        </Text>
        <Text
          fontSize={18}
          fontWeight="600"
          color="#2E2F2F"
          mb={8}
          textAlign="center"
        >
          Page non trouvée
        </Text>
        <Text
          fontSize={14}
          fontWeight="400"
          color="#5B5C5B"
          mb={32}
          textAlign="center"
          px={24}
        >
          {error ||
            "L'activité que tu cherches n'existe pas ou a été supprimée."}
        </Text>
        <Pressable onPress={() => router.back()}>
          <View
            backgroundColor="#006666"
            paddingHorizontal={32}
            paddingVertical={12}
            borderRadius={9999}
          >
            <Text color="#FFFFFF" fontWeight="700">
              Retour
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#F7F6F5" }}
        edges={["top"]}
      >
        <XStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          paddingTop={56}
          paddingBottom={16}
          px="$4"
          alignItems="center"
          zIndex={10}
          justifyContent="space-between"
          backgroundColor="#F7F6F5"
        >
          <Pressable onPress={() => router.back()}>
            <View
              width={40}
              height={40}
              borderRadius={20}
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons name="chevron-back" size={24} color="#006666" />
            </View>
          </Pressable>
          <Text fontWeight="800" color="#006666" fontSize={16}>
            {activity.title}
          </Text>
          <View width={40} />
        </XStack>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View px={24} pt="$4">
            <HeroSection activity={activity} />
            <ExperienceHeader activity={activity} />
            <ExperienceDescription activity={activity} />
            <SquadMembers activity={activity} />
            <PriceBreakdown activity={activity} />
          </View>
        </ScrollView>

        <ActionBar activity={activity} />
      </SafeAreaView>
    </>
  );
}
