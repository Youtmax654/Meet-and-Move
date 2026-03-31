import { Ionicons } from "@expo/vector-icons";
import { Avatar, Text, View, XStack, YStack } from "tamagui";
import { Activity } from "../../types/activity";

export function SquadMembers({ activity }: { activity?: Activity }) {
  const enrolledCount = activity?.enrolledCount || 0;
  const maxParticipants = activity?.max_participants || 0;

  return (
    <YStack backgroundColor="#F1F1F0" borderRadius={12} p={24} gap={24} mb={32}>
      <XStack justify="space-between" alignItems="center">
        <Text fontSize={18} fontWeight="700" color="#2E2F2F">
          L'Équipe
        </Text>
        <Text fontSize={14} fontWeight="500" color="#4953AC">
          {enrolledCount}/{maxParticipants} Inscrits
        </Text>
      </XStack>

      <XStack flexWrap="wrap" gap={16} justify="center">
        <YStack alignItems="center" gap={8} width={70}>
          <Avatar circular size={56} borderColor="#006666" borderWidth={2}>
            <Avatar.Image src={`https://i.pravatar.cc/150?u=${activity?.host?.id || "host"}`} />
            <Avatar.Fallback backgroundColor="#006666" />
          </Avatar>
          <Text fontSize={12} fontWeight="600" color="#2E2F2F" textAlign="center" numberOfLines={1}>
            {activity?.host?.username || "Hôte"}
          </Text>
          <Text fontSize={10} fontWeight="400" color="#5B5C5B" marginTop={-4}>
            (Hôte)
          </Text>
        </YStack>

        {activity?.participants?.filter(p => p.id !== activity.host?.id).map((participant) => (
          <YStack key={participant.id} alignItems="center" gap={8} width={70}>
            <Avatar circular size={56}>
              <Avatar.Image src={`https://i.pravatar.cc/150?u=${participant.id}`} />
              <Avatar.Fallback backgroundColor="#ADADAC" />
            </Avatar>
            <Text fontSize={12} fontWeight="400" color="#2E2F2F" textAlign="center" numberOfLines={1}>
              {participant.username}
            </Text>
          </YStack>
        ))}

        {enrolledCount < maxParticipants && (
          <YStack alignItems="center" gap={8} width={70}>
            <View
              width={56}
              height={56}
              borderRadius={28}
              borderWidth={2}
              borderColor="#ADADAC"
              borderStyle="dashed"
              backgroundColor="#E2E2E1"
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons name="add" size={24} color="#5B5C5B" />
            </View>
            <Text fontSize={12} color="#5B5C5B" fontWeight="400" textAlign="center">
              Votre Place
            </Text>
          </YStack>
        )}
      </XStack>
    </YStack>
  );
}
