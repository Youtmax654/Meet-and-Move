import React from "react";
import { Text, View, XStack, YStack } from "tamagui";
import { Activity } from "../../types/activity";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withTiming,
  Easing
} from "react-native-reanimated";

export function PriceBreakdown({ activity }: { activity?: Activity }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withDelay(300, withSpring(1, { damping: 12 }));
    opacity.value = withDelay(300, withTiming(1, { duration: 500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

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
        <Animated.View style={[{ alignItems: 'center', justifyContent: 'center' }, animatedStyle]}>
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
            
            {/* Animated Ring Overlay (simulated fill) */}
            <View 
              position="absolute" 
              top={-16} 
              left={-16} 
              right={-16} 
              bottom={-16} 
              borderRadius={91} 
              borderWidth={4} 
              borderColor="#006666"
              opacity={0.3}
            />
          </View>
        </Animated.View>

        <YStack gap={12} width="100%">
          {activity?.price_breakdown?.map((item, index) => (
            <XStack key={index} alignItems="center" justifyContent="space-between">
              <XStack alignItems="center" gap={12}>
                <View width={12} height={12} borderRadius={6} backgroundColor={item.color as any} />
                <Text fontSize={14} fontWeight="500" color="#2E2F2F">{item.label}</Text>
              </XStack>
              <Text fontSize={14} fontWeight="700" color="#2E2F2F">{item.amount.toFixed(2)}€</Text>
            </XStack>
          ))}
          
          {(!activity?.price_breakdown || activity.price_breakdown.length === 0) && (
            <Text color="#5B5C5B" textAlign="center" fontSize={14}>
              Aucun détail disponible
            </Text>
          )}
        </YStack>
      </YStack>
    </YStack>
  );
}
