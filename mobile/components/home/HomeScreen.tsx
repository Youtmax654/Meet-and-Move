import { useNetInfo } from "@react-native-community/netinfo";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";
import { ActivitiesSection } from "@/components/home/activities/ActivitiesSection";
import { HomeSearchBar } from "@/components/home/layout/HomeSearchBar";
import { HomeTopRow } from "@/components/home/layout/HomeTopRow";
import { NetworkErrorState } from "@/components/ui/network-error-state";
import { homeFeedSchema } from "@/features/home/schemas/feed.schema";
import { api } from "@/lib/api";

export function HomeScreen() {
  const netInfo = useNetInfo();

  const {
    data: activities,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["home-feed"],
    queryFn: async () => {
      const response = await api.get("/feed");
      return homeFeedSchema.parse(response.data);
    },
  });

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
          <HomeTopRow />

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

          <HomeSearchBar />

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
          ) : isError ? (
            <NetworkErrorState
              type={netInfo.isConnected === false ? "offline" : "server"}
              message="Vos activités n'ont pas pu être affichées en raison d'un problème serveur."
              onRetry={refetch}
            />
          ) : !activities || activities.length === 0 ? (
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
                Revenez plus tard pour découvrir de nouvelles expériences !
              </Text>
            </YStack>
          ) : (
            <ActivitiesSection activities={activities} />
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
