import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Circle, ScrollView, YStack } from "tamagui";

import { useQuery } from "@tanstack/react-query";
import { ProfileCoverHeader } from "@/features/profile/components/ProfileCoverHeader";
import { ProfileIdentityCard } from "@/features/profile/components/ProfileIdentityCard";
import { ProfileStatsRow } from "@/features/profile/components/ProfileStatsRow";
import {
  ProfileErrorState,
  ProfileLoadingState,
} from "@/features/profile/components/ProfileStates";
import {
  getCurrentUser,
  getCurrentUserActivities,
} from "@/features/profile/profile.service";
import { ProfileActivitiesGrid } from "@/features/profile/components/ProfileActivitiesGrid";
import { apiImageSource } from "@/lib/image-source";
import { getUserId } from "@/lib/auth-client";

export default function ProfilScreen() {
  const router = useRouter();
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });
  const {
    data: activities,
    isLoading: isActivitiesLoading,
    isError: isActivitiesError,
  } = useQuery({
    queryKey: ["current-user-activities"],
    queryFn: getCurrentUserActivities,
  });

  if (isLoading) {
    return <ProfileLoadingState />;
  }

  if (isError || !profile) {
    return <ProfileErrorState />;
  }

  const createdAtShort = profile.createdAt
    ? profile.createdAt.toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      })
    : "-";
  const meetcoinsLabel = formatStatValue(profile.meetcoinsBalance);
  const levelLabel = String(profile.gamificationLevel ?? 1);
  const userId = getUserId();
  const bannerUrl = getUserBannerUrl(profile.id);
  const avatarSource = apiImageSource(
    `/users/${userId}/image`,
    "https://imgs.search.brave.com/kloi-zWWknKoraC1e4fDjSEu4hcqeFKE8mTITnb7fCM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ5/NTA4ODA0My92ZWN0/b3IvdXNlci1wcm9m/aWxlLWljb24tYXZh/dGFyLW9yLXBlcnNv/bi1pY29uLXByb2Zp/bGUtcGljdHVyZS1w/b3J0cmFpdC1zeW1i/b2wtZGVmYXVsdC1w/b3J0cmFpdC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9ZGhW/MnAxSndtbG9CVE9h/R0F0YUEzQVcxS1Nu/anNkTXQ3LVVfM0Va/RWxaMD0",
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#F7F6F5" }}
        edges={["left", "right", "bottom"]}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <YStack>
            <ProfileCoverHeader bannerUrl={bannerUrl} />

            <YStack px={16} mt={-36} gap={16}>
              <ProfileIdentityCard
                avatarSource={avatarSource}
                username={profile.name}
                isVerified={profile.emailVerified}
                email={profile.email}
                levelLabel={levelLabel}
                bio={profile.bio}
                onEditPress={() => router.push("/profile/edit")}
              />

              <ProfileStatsRow
                levelLabel={levelLabel}
                meetcoinsLabel={meetcoinsLabel}
                memberSinceLabel={createdAtShort}
              />

              <ProfileActivitiesGrid
                activities={activities ?? []}
                isLoading={isActivitiesLoading}
                isError={isActivitiesError}
                onPressActivity={(activityId) =>
                  router.push(`/experience/${activityId}`)
                }
              />
            </YStack>
          </YStack>
        </ScrollView>

        <Circle
          position="absolute"
          bottom={96}
          right={20}
          size={56}
          backgroundColor="#006666"
          elevation={6}
          shadowColor="#000"
          shadowOpacity={0.2}
          shadowRadius={6}
          shadowOffset={{ width: 0, height: 3 }}
          pressStyle={{ scale: 0.96 }}
          onPress={() => router.push("/activities/create")}
          accessibilityLabel="Créer une activité"
        >
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </Circle>
      </SafeAreaView>
    </>
  );
}

function formatStatValue(value: number | null) {
  if (value === null || value === undefined) {
    return "-";
  }
  return String(value);
}

function getUserBannerUrl(userId: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(userId)}/1200/600`;
}

function getUserAvatarUrl(userId: string) {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(userId)}`;
}
