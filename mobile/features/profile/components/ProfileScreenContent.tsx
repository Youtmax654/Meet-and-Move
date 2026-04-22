import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, XStack, YStack } from "tamagui";

import { MemoriesSection } from "@/components/activities/memories/MemoriesSection";
import { TripsList } from "@/components/activities/trips/TripsList";
import type { Memory, Trip, TripStatus } from "@/components/activities/types";
import { api } from "@/lib/api";
import { profileSchema } from "@/features/profile/schemas/profile.schema";

export function ProfileScreenContent({
  userId,
  isOwnProfile,
}: {
  userId: string;
  isOwnProfile: boolean;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TripStatus>("upcoming");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-profile", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const response = await api.get(`/users/${userId}/profile`);
      return profileSchema.parse(response.data);
    },
  });

  const mapped = useMemo(() => {
    if (!data) return { trips: [] as Trip[], memories: [] as Memory[] };
    const trips: Trip[] = data.createdActivities.map((activity) => {
      const eventDate = activity.eventDate ? new Date(activity.eventDate) : null;
      return {
        id: activity.id,
        status: "upcoming",
        coverImage: activity.coverImage,
        tag: activity.category?.name?.toUpperCase() || "SQUAD",
        dateRange: eventDate
          ? eventDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
          : "Date à confirmer",
        locationArea: activity.locationCity,
        locationCity: activity.locationCity,
        title: activity.title,
        description: activity.description ?? "",
        avatars: [
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
        ],
        extraAvatarsCount: activity.enrolledCount > 2 ? `+${activity.enrolledCount - 2}` : "",
        chatId: activity.chatId,
      };
    });

    const memories: Memory[] = data.pastActivities.map((activity) => {
      const eventDate = activity.eventDate ? new Date(activity.eventDate) : null;
      return {
        id: activity.id,
        title: activity.title,
        subtitle: `À ${activity.locationCity}`,
        dateBadge: eventDate
          ? eventDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
          : "Date passée",
        coverImage: activity.coverImage,
      };
    });

    return { trips, memories };
  }, [data]);

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="#F7F6F5">
        <ActivityIndicator size="large" color="#006666" />
      </YStack>
    );
  }

  if (isError || !data) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" px={24} gap={8} backgroundColor="#F7F6F5">
        <Text fontSize={18} color="#1E2228" fontWeight="700">
          Profil indisponible
        </Text>
        <Text fontSize={14} color="#5B5C5B" textAlign="center">
          Impossible de charger ce profil pour le moment.
        </Text>
      </YStack>
    );
  }

  const cover =
    data.coverImage ||
    "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1400&q=80";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack>
          <YStack position="relative" height={210} backgroundColor="#E2E2E1">
            <Image source={{ uri: cover }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
            <YStack
              position="absolute"
              top={14}
              left={14}
              right={14}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              {!isOwnProfile ? (
                <Button
                  circular
                  chromeless
                  size="$3"
                  onPress={() => router.back()}
                  icon={<Ionicons name="chevron-back" size={20} color="#FFFFFF" />}
                />
              ) : (
                <YStack width={36} />
              )}
              {isOwnProfile ? (
                <Button
                  backgroundColor="rgba(0,0,0,0.45)"
                  color="#FFFFFF"
                  borderRadius={999}
                  px={12}
                  onPress={() => router.push("/profil/edit")}
                  icon={<Ionicons name="create-outline" size={14} color="#FFFFFF" />}
                >
                  Modifier mon profil
                </Button>
              ) : null}
            </YStack>
          </YStack>

          <YStack px={16} mt={-36} gap={16}>
            <YStack backgroundColor="#FFFFFF" borderRadius={16} p={16} gap={12}>
              <XStack alignItems="center" gap={12}>
                <YStack
                  width={72}
                  height={72}
                  borderRadius={999}
                  overflow="hidden"
                  borderWidth={3}
                  borderColor="#FFFFFF"
                  backgroundColor="#E2E2E1"
                >
                  <Image source={{ uri: data.avatar }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                </YStack>
                <YStack flex={1} gap={4}>
                  <XStack alignItems="center" gap={8}>
                    <Text fontSize={22} fontWeight="800" color="#1E2228">
                      {data.username}
                    </Text>
                    {data.isVerified ? <Ionicons name="checkmark-circle" size={18} color="#006666" /> : null}
                  </XStack>
                  <XStack alignItems="center" gap={6}>
                    <Ionicons name="location-outline" size={14} color="#5B5C5B" />
                    <Text fontSize={13} color="#5B5C5B">
                      {data.location || "Localisation non renseignée"}
                    </Text>
                  </XStack>
                  <XStack>
                    <YStack backgroundColor="#F1F1F0" borderRadius={999} px={10} py={4}>
                      <Text fontSize={12} fontWeight="700" color="#4953AC">
                        Niveau {data.gamificationLevel ?? 1}
                      </Text>
                    </YStack>
                  </XStack>
                </YStack>
              </XStack>

              <Text fontSize={14} color="#2E2F2F">
                {data.bio || "Aucune bio pour le moment."}
              </Text>
            </YStack>

            <XStack gap={10}>
              <YStack flex={1} backgroundColor="#FFFFFF" borderRadius={14} p={12} alignItems="center">
                <Text fontSize={20} fontWeight="800" color="#006666">
                  {data.stats.createdCount}
                </Text>
                <Text fontSize={12} color="#5B5C5B">
                  Activités créées
                </Text>
              </YStack>
              <YStack flex={1} backgroundColor="#FFFFFF" borderRadius={14} p={12} alignItems="center">
                <Text fontSize={20} fontWeight="800" color="#4953AC">
                  {data.stats.participationsCount}
                </Text>
                <Text fontSize={12} color="#5B5C5B">
                  Participations
                </Text>
              </YStack>
              <YStack flex={1} backgroundColor="#FFFFFF" borderRadius={14} p={12} alignItems="center">
                <Text fontSize={20} fontWeight="800" color="#2E2F2F">
                  {data.stats.averageRating != null ? data.stats.averageRating.toFixed(1) : "N/A"}
                </Text>
                <Text fontSize={12} color="#5B5C5B">
                  Note moyenne
                </Text>
              </YStack>
            </XStack>

            <YStack>
              <XStack
                backgroundColor="#F2F2F2"
                borderRadius={999}
                padding={4}
                marginBottom={24}
              >
                <YStack flex={1}>
                  <Button
                    chromeless
                    onPress={() => setActiveTab("upcoming")}
                    backgroundColor={activeTab === "upcoming" ? "#FFFFFF" : "transparent"}
                    borderRadius={999}
                  >
                    <Text
                      fontSize={14}
                      fontWeight={activeTab === "upcoming" ? "800" : "600"}
                      color={activeTab === "upcoming" ? "#006666" : "#6B727B"}
                    >
                      Activités créées
                    </Text>
                  </Button>
                </YStack>
                <YStack flex={1}>
                  <Button
                    chromeless
                    onPress={() => setActiveTab("past")}
                    backgroundColor={activeTab === "past" ? "#FFFFFF" : "transparent"}
                    borderRadius={999}
                  >
                    <Text
                      fontSize={14}
                      fontWeight={activeTab === "past" ? "800" : "600"}
                      color={activeTab === "past" ? "#1F2937" : "#6B727B"}
                    >
                      Activités passées
                    </Text>
                  </Button>
                </YStack>
              </XStack>

              {activeTab === "upcoming" ? (
                mapped.trips.length > 0 ? (
                  <TripsList trips={mapped.trips} />
                ) : (
                  <Text color="#5B5C5B">Aucune activité créée pour le moment.</Text>
                )
              ) : mapped.memories.length > 0 ? (
                <MemoriesSection memories={mapped.memories} layout="vertical" />
              ) : (
                <Text color="#5B5C5B">Aucune activité passée à afficher.</Text>
              )}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

