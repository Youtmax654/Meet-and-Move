import { Image } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";

import { IconSymbol } from "@/components/ui/icon-symbol";

type ProfileIdentityCardProps = {
  avatarUrl: string;
  username: string;
  isVerified: boolean | null;
  email: string;
  levelLabel: string;
  bio: string | null;
  onEditPress: () => void;
};

export function ProfileIdentityCard({
  avatarUrl,
  username,
  isVerified,
  email,
  levelLabel,
  bio,
  onEditPress,
}: ProfileIdentityCardProps) {
  return (
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
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </YStack>
        <YStack flex={1} gap={4}>
          <XStack alignItems="center" justifyContent="space-between">
            <XStack alignItems="center" gap={8}>
              <Text fontSize={22} fontWeight="800" color="#1E2228">
                {username}
              </Text>
              {isVerified ? (
                <YStack
                  backgroundColor="#E6F2F2"
                  borderRadius={999}
                  px={8}
                  py={2}
                >
                  <Text fontSize={11} fontWeight="700" color="#006666">
                    Vérifié
                  </Text>
                </YStack>
              ) : null}
            </XStack>
            <Button
              width={32}
              height={32}
              padding={0}
              backgroundColor="#F1F1F0"
              borderRadius={999}
              alignItems="center"
              justifyContent="center"
              onPress={onEditPress}
              accessibilityLabel="Modifier le profil"
            >
              <IconSymbol name="square.and.pencil" size={16} color="#2E2F2F" />
            </Button>
          </XStack>
          <Text fontSize={14} color="#5B5C5B">
            {email}
          </Text>
          <XStack>
            <YStack backgroundColor="#F1F1F0" borderRadius={999} px={10} py={4}>
              <Text fontSize={12} fontWeight="700" color="#4953AC">
                Niveau {levelLabel}
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </XStack>

      <Text fontSize={14} color="#2E2F2F">
        {bio || "Aucune bio pour le moment."}
      </Text>
    </YStack>
  );
}
