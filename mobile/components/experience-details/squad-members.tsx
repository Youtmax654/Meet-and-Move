import { Avatar, Text, View, XStack, YStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

export function SquadMembers() {
  return (
    <YStack backgroundColor="#F1F1F0" borderRadius={12} p={24} gap={24} mb={32}>
      <XStack justify="space-between" alignItems="center">
        <Text fontSize={18} fontWeight="700" color="#2E2F2F">
          L'Équipe
        </Text>
        <Text fontSize={14} fontWeight="500" color="#4953AC">
          5/8 Inscrits
        </Text>
      </XStack>
      
      <XStack flexWrap="wrap" gap={8} justify="center">
        {/* Hôte */}
        <YStack alignItems="center" gap={8}>
          <Avatar circular size={56} borderColor="#006666" borderWidth={2}>
            <Avatar.Image src="https://i.pravatar.cc/150?u=a" />
          </Avatar>
          <Text fontSize={12} fontWeight="600" color="#2E2F2F">
            Sarah (Hôte)
          </Text>
        </YStack>
        
        <YStack alignItems="center" gap={8}>
          <Avatar circular size={56}>
            <Avatar.Image src="https://i.pravatar.cc/150?u=b" />
          </Avatar>
          <Text fontSize={12} fontWeight="400" color="#2E2F2F">
            Marc
          </Text>
        </YStack>

        <YStack alignItems="center" gap={8}>
          <Avatar circular size={56}>
            <Avatar.Image src="https://i.pravatar.cc/150?u=c" />
          </Avatar>
          <Text fontSize={12} fontWeight="400" color="#2E2F2F">
            Elena
          </Text>
        </YStack>

        <YStack alignItems="center" gap={8}>
          <Avatar circular size={56}>
            <Avatar.Image src="https://i.pravatar.cc/150?u=d" />
          </Avatar>
          <Text fontSize={12} fontWeight="400" color="#2E2F2F">
            James
          </Text>
        </YStack>

        {/* Emplacement vide "Votre Place" */}
        <YStack alignItems="center" gap={8}>
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
          <Text fontSize={12} color="#5B5C5B" fontWeight="400">
            Votre Place
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}
