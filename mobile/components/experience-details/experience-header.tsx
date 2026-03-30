import { Text, View, XStack, YStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

export function ExperienceHeader() {
  return (
    <YStack gap={16} py={24}>
      <Text fontSize={20} fontWeight="700" color="#2E2F2F" lineHeight={30} letterSpacing={-0.75}>
        Randonnée sur la Crête{"\n"}du Mont-Blanc
      </Text>
      
      <XStack gap={12} flexWrap="wrap">
        {/* Info Badges */}
        <View flexDirection="row" alignItems="center" backgroundColor="#F1F1F0" borderRadius={8} px={12} py={6} gap={6}>
          <Text fontSize={14} fontWeight="500" color="#2E2F2F">
            17:00 • 3 Heures
          </Text>
        </View>
        
        <View flexDirection="row" alignItems="center" backgroundColor="#F1F1F0" borderRadius={8} px={12} py={6} gap={6}>
          <Text fontSize={14} fontWeight="500" color="#2E2F2F">
            8 Max
          </Text>
        </View>
        
        <View flexDirection="row" alignItems="center" backgroundColor="#F1F1F0" borderRadius={8} px={12} py={6} gap={6}>
          <Text fontSize={14} fontWeight="500" color="#2E2F2F">
            Intermédiaire
          </Text>
        </View>
      </XStack>
      
      <XStack alignItems="baseline" gap={4}>
        <Text fontSize={30} fontWeight="800" color="#4953AC" lineHeight={36}>
          55€
        </Text>
        <Text fontSize={14} fontWeight="400" color="#5B5C5B">
          /personne
        </Text>
      </XStack>
    </YStack>
  );
}
