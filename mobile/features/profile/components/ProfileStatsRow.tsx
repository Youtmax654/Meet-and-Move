import { Text, XStack, YStack } from "tamagui";

type ProfileStatsRowProps = {
  levelLabel: string;
  meetcoinsLabel: string;
  memberSinceLabel: string;
};

export function ProfileStatsRow({
  levelLabel,
  meetcoinsLabel,
  memberSinceLabel,
}: ProfileStatsRowProps) {
  return (
    <XStack gap={10}>
      <YStack
        flex={1}
        backgroundColor="#FFFFFF"
        borderRadius={14}
        p={12}
        alignItems="center"
      >
        <Text fontSize={12} color="#5B5C5B">
          Niveau
        </Text>
        <Text fontSize={20} fontWeight="800" color="#006666">
          {levelLabel}
        </Text>
      </YStack>
      <YStack
        flex={1}
        backgroundColor="#FFFFFF"
        borderRadius={14}
        p={12}
        alignItems="center"
      >
        <Text fontSize={12} color="#5B5C5B">
          Meetcoins
        </Text>
        <Text fontSize={20} fontWeight="800" color="#4953AC">
          {meetcoinsLabel}
        </Text>
      </YStack>
      <YStack
        flex={1}
        backgroundColor="#FFFFFF"
        borderRadius={14}
        p={12}
        alignItems="center"
      >
        <Text fontSize={12} color="#5B5C5B">
          Membre depuis
        </Text>
        <Text fontSize={20} fontWeight="800" color="#2E2F2F">
          {memberSinceLabel}
        </Text>
      </YStack>
    </XStack>
  );
}
