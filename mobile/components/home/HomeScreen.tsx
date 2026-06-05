import { useInfiniteQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";
import { ActivitiesSection } from "@/components/home/activities/ActivitiesSection";
import { HomeSearchBar } from "@/components/home/layout/HomeSearchBar";
import { HomeTopRow } from "@/components/home/layout/HomeTopRow";
import { feedPageSchema, type FeedPage } from "@/features/home/schemas/feed.schema";
import { api } from "@/lib/api";

const LIMIT = 20;

type UserLocation = { lat: number; lng: number } | null;

async function fetchFeedPage(
  location: UserLocation,
  offset: number,
  search: string,
): Promise<FeedPage> {
  const params = new URLSearchParams({
    limit: String(LIMIT),
    offset: String(offset),
  });
  if (location) {
    params.set("lat", String(location.lat));
    params.set("lng", String(location.lng));
  }
  if (search.trim()) {
    params.set("search", search.trim());
  }
  const response = await api.get(`/feed?${params.toString()}`);
  return feedPageSchema.parse(response.data);
}

export function HomeScreen() {
  const [location, setLocation] = useState<UserLocation>(null);
  const [locationLabel, setLocationLabel] = useState<string | undefined>(undefined);
  const [locationReady, setLocationReady] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const { latitude, longitude } = loc.coords;
        setLocation({ lat: latitude, lng: longitude });

        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (place) {
          const city = place.city ?? place.subregion ?? place.region ?? "";
          const country = place.isoCountryCode ?? "";
          setLocationLabel([city, country].filter(Boolean).join(", "));
        }
      } else {
        setLocationLabel("Position non disponible");
      }
      setLocationReady(true);
    })();
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["home-feed", location, debouncedSearch],
    queryFn: ({ pageParam }) =>
      fetchFeedPage(location, pageParam as number, debouncedSearch),
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.hasMore ? (lastPageParam as number) + LIMIT : undefined,
    initialPageParam: 0,
    enabled: locationReady,
  });

  const activities = data?.pages.flatMap((p) => p.activities) ?? [];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F7F6F5" }}
      edges={["top"]}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: "#F7F6F5" }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 164,
        }}
        showsVerticalScrollIndicator={false}
      >
        <YStack>
          <HomeTopRow locationLabel={locationLabel} />

          <Text
            fontSize={39}
            lineHeight={40}
            letterSpacing={-0.8}
            color="#1E2228"
            fontWeight="800"
            marginBottom="$4"
            maxWidth={340}
          >
            Trouvez votre prochaine activité
          </Text>

          <HomeSearchBar value={search} onChangeText={setSearch} />

          {isLoading ? (
            <YStack
              alignItems="center"
              justifyContent="center"
              paddingVertical={40}
            >
              <ActivityIndicator size="large" color="#008A87" />
              <Text fontSize={14} color="#6B727B" marginTop={12}>
                Chargement des données...
              </Text>
            </YStack>
          ) : activities.length === 0 ? (
            <YStack
              alignItems="center"
              justifyContent="center"
              paddingVertical={60}
              gap={12}
            >
              <Text fontSize={18} color="#1E2228" fontWeight="600">
                Aucune activité disponible
              </Text>
              <Text fontSize={14} color="#5B5C5B" textAlign="center">
                {search.trim()
                  ? `Aucun résultat pour "${search}"`
                  : location
                  ? "Aucune activité près de chez vous. Revenez plus tard !"
                  : "Revenez plus tard pour découvrir de nouvelles expériences !"}
              </Text>
            </YStack>
          ) : (
            <ActivitiesSection
              activities={activities}
              onLoadMore={fetchNextPage}
              hasMore={hasNextPage ?? false}
              isLoadingMore={isFetchingNextPage}
            />
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
