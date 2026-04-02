import { Text, YStack } from "tamagui";
import { Activity } from "../../types/activity";

export function ExperienceDescription({ activity }: { activity?: Activity }) {
  return (
    <YStack gap={16} pb={32}>
      <Text fontSize={20} fontWeight="700" color="#2E2F2F">
        L'Expérience
      </Text>
      <Text fontSize={16} fontWeight="400" color="#5B5C5B" lineHeight={26}>
        {activity?.description || "Aucune description disponible."}
      </Text>
    </YStack>
  );
}
