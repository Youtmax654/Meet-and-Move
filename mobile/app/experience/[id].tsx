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
import { NotFoundError } from "../../components/ui/not-found-error";
import { api } from "../../lib/api";

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
        const url = `/activities/${id}`;
        console.log(`Fetching activity from: ${url}`);
        
        const response = await api.get(url);
        console.log("Activity data loaded:", response.data.title);
        setActivity(response.data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        
        if (err.response?.status === 404) {
          setError("Activité introuvable - 404");
        } else {
          setError(err.response?.data?.error || err.message || "Une erreur est survenue");
        }
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
      <NotFoundError 
        title={error?.includes("404") ? "Activité introuvable" : "Erreur de chargement"}
        message={error || "L'activité que tu cherches n'existe pas ou a été supprimée."}
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
