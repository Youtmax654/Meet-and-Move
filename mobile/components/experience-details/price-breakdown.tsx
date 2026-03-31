import { Text, View, XStack, YStack } from "tamagui";
import { Activity } from "../../types/activity";

export function PriceBreakdown({ activity }: { activity?: Activity }) {
  return (
    <YStack 
      backgroundColor="#FFFFFF" 
      borderRadius={12} 
      p={32} 
      gap={32} 
      mb={32} 
      shadowColor="#000"
      shadowOpacity={0.05}
      shadowRadius={2}
      shadowOffset={{ width: 0, height: 1 }}
      elevation={2}
    >
      <Text fontSize={18} fontWeight="700" color="#2E2F2F">
        Transparence des Prix
      </Text>
      
      <YStack gap={32} alignItems="center">
        {/* Placeholder for Donut Chart */}
        <View 
          width={150} 
          height={150} 
          borderRadius={75} 
          borderWidth={16} 
          borderColor="#F1F1F0" 
          alignItems="center" 
          justifyContent="center"
          position="relative"
        >
          <Text fontSize={24} fontWeight="800" color="#2E2F2F">
            {activity?.price !== undefined ? `${activity.price}€` : "..."}
          </Text>
          <Text fontSize={10} fontWeight="700" color="#5B5C5B" textTransform="uppercase" letterSpacing={1}>
            Total
          </Text>
        </View>

        <YStack gap={12} width="100%">
          <XStack alignItems="center" justifyContent="space-between">
            <XStack alignItems="center" gap={12}>
              <View width={12} height={12} borderRadius={6} backgroundColor="#006666" />
              <Text fontSize={14} fontWeight="500" color="#2E2F2F">Restauration</Text>
            </XStack>
            <Text fontSize={14} fontWeight="700" color="#2E2F2F">22.00€</Text>
          </XStack>
          
          <XStack alignItems="center" justifyContent="space-between">
            <XStack alignItems="center" gap={12}>
              <View width={12} height={12} borderRadius={6} backgroundColor="#4953AC" />
              <Text fontSize={14} fontWeight="500" color="#2E2F2F">Frais de Guide</Text>
            </XStack>
            <Text fontSize={14} fontWeight="700" color="#2E2F2F">24.75€</Text>
          </XStack>
          
          <XStack alignItems="center" justifyContent="space-between">
            <XStack alignItems="center" gap={12}>
              <View width={12} height={12} borderRadius={6} backgroundColor="#9C3D2A" />
              <Text fontSize={14} fontWeight="500" color="#2E2F2F">Sécurité & Assurance</Text>
            </XStack>
            <Text fontSize={14} fontWeight="700" color="#2E2F2F">8.25€</Text>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
