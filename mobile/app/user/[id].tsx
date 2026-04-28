import { Stack, useLocalSearchParams } from "expo-router";

export default function UserProfileScreen() {
  const params = useLocalSearchParams();
  const userId = (params.id as string) ?? "";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
    </>
  );
}
