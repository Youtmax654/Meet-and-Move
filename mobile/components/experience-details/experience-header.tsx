import { Text, View, XStack, YStack } from "tamagui";
import { Activity } from "../../types/activity";

export function ExperienceHeader({ activity }: { activity?: Activity }) {
  return (
    <YStack gap={16} py={24}>
      <Text fontSize={20} fontWeight="700" color="#2E2F2F" lineHeight={30} letterSpacing={-0.75}>
        {activity?.title || "Chargement..."}
      </Text>
      <XStack gap={12} flexWrap="wrap">
        <View flexDirection="row" alignItems="center" backgroundColor="#F1F1F0" borderRadius={8} px={12} py={6} gap={6}>
          <Text fontSize={14} fontWeight="500" color="#2E2F2F">
            {activity?.duration_hours ? `${activity.duration_hours} Heures` : "Durée non précisée"}
          </Text>
        </View>

        <View flexDirection="row" alignItems="center" backgroundColor="#F1F1F0" borderRadius={8} px={12} py={6} gap={6}>
          <Text fontSize={14} fontWeight="500" color="#2E2F2F">
            {activity?.max_participants ? `Max ${activity.max_participants} personnes` : "Places limitées"}
          </Text>
        </View>

        <View flexDirection="row" alignItems="center" backgroundColor="#F1F1F0" borderRadius={8} px={12} py={6} gap={6}>
          <Text fontSize={14} fontWeight="500" color="#2E2F2F">
            {activity?.difficulty 
              ? (activity.difficulty === 'easy' ? 'Débutant' : 
                 activity.difficulty === 'medium' ? 'Intermédiaire' : 
                 activity.difficulty === 'hard' ? 'Expert' : activity.difficulty)
              : "Tout niveau"}
          </Text>
        </View>
      </XStack>

      <XStack alignItems="baseline" gap={4}>
        <Text fontSize={30} fontWeight="800" color="#4953AC" lineHeight={36}>
          {activity?.price !== undefined ? `${activity.price}€` : "Gratuit"}
        </Text>
        <Text fontSize={14} fontWeight="400" color="#5B5C5B">
          /personne
        </Text>
      </XStack>
    </YStack>
  );
}
