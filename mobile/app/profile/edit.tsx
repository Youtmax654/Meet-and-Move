import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, YStack } from "tamagui";

export default function EditProfileScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Modifier mon profil" }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }}>
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          px={24}
          gap={12}
        >
          <Text fontSize={22} fontWeight="800" color="#1E2228">
            Modifier mon profil
          </Text>
          <Text fontSize={14} color="#5B5C5B" textAlign="center">
            L&apos;édition du profil sera branchée sur les endpoints de mise à
            jour dans une prochaine étape.
          </Text>
          <Button
            mt={8}
            backgroundColor="#006666"
            color="#FFFFFF"
            borderRadius={12}
            onPress={() => router.back()}
          >
            Retour
          </Button>
        </YStack>
      </SafeAreaView>
    </>
  );
}
