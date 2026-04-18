import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, XStack } from "tamagui";

import { ActionBar } from "@/components/experience-details/action-bar";
import { activityDetailsSchema } from "@/features/experience/schemas/activity-details.schema";
import { api } from "@/lib/api";
import { ExperienceDescription } from "../../components/experience-details/experience-description";
import { ExperienceHeader } from "../../components/experience-details/experience-header";
import { HeroSection } from "../../components/experience-details/hero-section";
import { PriceBreakdown } from "../../components/experience-details/price-breakdown";
import { SquadMembers } from "../../components/experience-details/squad-members";
import { NotFoundError } from "../../components/ui/not-found-error";
import type { Activity } from "../../types/activity";

export default function ExperienceDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const {
    data: activity,
    isLoading,
    isError,
    error,
  } = useQuery<Activity, unknown>({
    queryKey: ["activity-details", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await api.get(`/activities/${id}`);
      return activityDetailsSchema.parse(response.data);
    },
  });

  const errorMessage = (() => {
    if (!isError || !error) return null;
    if (error instanceof AxiosError && error.response?.status === 404) {
      return "Activité introuvable - 404";
    }

    if (
      error instanceof AxiosError &&
      typeof error.response?.data === "object" &&
      error.response?.data !== null &&
      "error" in error.response.data &&
      typeof (error.response.data as { error?: unknown }).error === "string"
    ) {
      return (error.response.data as { error: string }).error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Une erreur est survenue";
  })();

  if (isLoading) {
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

  if (isError || !activity) {
    return (
      <NotFoundError
        title={
          errorMessage?.includes("404")
            ? "Activité introuvable"
            : "Erreur de chargement"
        }
        message={
          errorMessage ||
          "L'activité que tu cherches n'existe pas ou a été supprimée."
        }
        buttonText="Retour"
        onPress={() => router.back()}
      />
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
