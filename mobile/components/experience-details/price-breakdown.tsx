import React from "react";
import { Text, View, XStack, YStack } from "tamagui";
import { Activity } from "../../types/activity";
import Svg, { Circle, G } from "react-native-svg";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withTiming,
  useAnimatedProps,
  interpolate
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RADIUS = 60;
const STROKE_WIDTH = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function DonutSegment({ 
  percentage, 
  offset, 
  color, 
  delay 
}: { 
  percentage: number; 
  offset: number; 
  color: string; 
  delay: number;
}) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration: 1000 }));
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * percentage * progress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <AnimatedCircle
      cx="75"
      cy="75"
      r={RADIUS}
      stroke={color}
      strokeWidth={STROKE_WIDTH}
      strokeDasharray={CIRCUMFERENCE}
      animatedProps={animatedProps}
      strokeLinecap="round"
      rotation={offset * 360 - 90}
      origin="75, 75"
      fill="transparent"
    />
  );
}

export function PriceBreakdown({ activity }: { activity?: Activity }) {
  const containerScale = useSharedValue(0.8);
  const containerOpacity = useSharedValue(0);

  React.useEffect(() => {
    containerScale.value = withSpring(1);
    containerOpacity.value = withTiming(1, { duration: 500 });
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
    opacity: containerOpacity.value,
  }));

  // Default breakdown if missing (Fallback)
  const defaultBreakdown = [
    { label: "Frais de service", amount: (activity?.price || 0) * 0.2, color: "#4953AC" },
    { label: "Organisation", amount: (activity?.price || 0) * 0.8, color: "#006666" },
  ];

  const breakdown = (activity?.price_breakdown && activity.price_breakdown.length > 0) 
    ? activity.price_breakdown 
    : defaultBreakdown;

  // Calcul des segments
  const total = activity?.price || 1;
  let currentOffset = 0;
  const segments = breakdown.map((item) => {
    const percentage = item.amount / total;
    const segment = {
      ...item,
      percentage,
      offset: currentOffset,
    };
    currentOffset += percentage;
    return segment;
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
        <Animated.View style={[{ width: 150, height: 150, alignItems: 'center', justifyContent: 'center' }, animatedContainerStyle]}>
          <Svg width={150} height={150} viewBox="0 0 150 150">
            <G rotation={-90} origin="75, 75">
              {/* background track */}
              <Circle
                cx="75"
                cy="75"
                r={RADIUS}
                stroke="#F1F1F0"
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
              />
              {/* Dynamic segments */}
              {segments.map((segment, index) => (
                <DonutSegment
                  key={index}
                  percentage={segment.percentage}
                  offset={segment.offset}
                  color={segment.color}
                  delay={500 + index * 100}
                />
              ))}
            </G>
          </Svg>
          
          <View position="absolute" alignItems="center" justifyContent="center">
            <Text fontSize={24} fontWeight="800" color="#2E2F2F">
              {activity?.price !== undefined ? `${activity.price}€` : "..."}
            </Text>
            <Text fontSize={10} fontWeight="700" color="#5B5C5B" textTransform="uppercase" letterSpacing={1}>
              Total
            </Text>
          </View>
        </Animated.View>

        <YStack gap={12} width="100%">
          {breakdown.map((item, index) => (
            <XStack key={index} alignItems="center" justifyContent="space-between">
              <XStack alignItems="center" gap={12}>
                <View width={12} height={12} borderRadius={6} backgroundColor={item.color as any} />
                <Text fontSize={14} fontWeight="500" color="#2E2F2F">{item.label}</Text>
              </XStack>
              <Text fontSize={14} fontWeight="700" color="#2E2F2F">{item.amount.toFixed(2)}€</Text>
            </XStack>
          ))}
        </YStack>
      </YStack>
    </YStack>
  );
}
