import { Stack, useLocalSearchParams } from "expo-router";

import { ProfileScreenContent } from "@/features/profile/components/ProfileScreenContent";

export default function UserProfileScreen() {
  const params = useLocalSearchParams();
  const userId = (params.id as string) ?? "";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileScreenContent userId={userId} isOwnProfile={false} />
    </>
  );
}

