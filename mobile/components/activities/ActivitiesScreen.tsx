import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";

import { TripTabs } from "@/components/activities/layout/TripTabs";
import { MemoriesSection } from "@/components/activities/memories/MemoriesSection";
import { TripsList } from "@/components/activities/trips/TripsList";
import { Memory, Trip, TripStatus } from "@/components/activities/types";
import { useToast } from "@/context/toast-context";

import { api } from "@/lib/api";

export function ActivitiesScreen() {
  const [activeTab, setActiveTab] = useState<TripStatus>("upcoming");
  const { showToast } = useToast();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinedActivities = async () => {
      try {
        setLoading(true);

        const response = await api.get("/activities/joined");
        const data = response.data;
        const now = new Date();

        const fetchedTrips: Trip[] = [];
        const fetchedMemories: Memory[] = [];

        data.forEach((activity: any) => {
          const activityDate = new Date(activity.eventDate);
          const isUpcoming = activityDate >= now;

          const dateRange = activityDate.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
          });

          if (isUpcoming) {
            fetchedTrips.push({
              id: activity.id,
              status: "upcoming",
              coverImage: activity.coverImage,
              tag: activity.category?.name?.toUpperCase() || "SQUAD",
              dateRange: dateRange,
              locationArea: activity.locationCity,
              locationCity: activity.locationCity,
              title: activity.title,
              description: activity.description,
              avatars: [
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
              ],
              extraAvatarsCount:
                activity.enrolledCount > 2
                  ? `+${activity.enrolledCount - 2}`
                  : "",
              chatId: activity.chatId,
            });
          } else {
            // Past - so it's a memory
            fetchedMemories.push({
              id: activity.id,
              title: activity.title,
              subtitle: `À ${activity.locationCity}`,
              dateBadge: activityDate.toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              }),
              coverImage: activity.coverImage,
            });
          }
        });

        setTrips(fetchedTrips);
        setMemories(fetchedMemories);
      } catch (error) {
        console.error("Error fetching user activities:", error);
        showToast("Impossible de charger tes activités.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedActivities();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FAF9F8" }}
      edges={["top"]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <YStack>
          <Text
            fontSize={28}
            color="#1E2228"
            fontWeight="800"
            marginBottom={24}
          >
            Mes Activités
          </Text>

          <TripTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {loading ? (
            <ActivityIndicator
              style={{ marginTop: 24 }}
              size="large"
              color="#006666"
            />
          ) : activeTab === "upcoming" ? (
            <>
              <TripsList trips={trips.filter((t) => t.status === "upcoming")} />
              <MemoriesSection
                memories={memories}
                layout="horizontal"
                onSeeAllPress={() => setActiveTab("past")}
              />
            </>
          ) : (
            <MemoriesSection
              memories={memories}
              layout="vertical"
              onSeeAllPress={() => setActiveTab("past")}
            />
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
