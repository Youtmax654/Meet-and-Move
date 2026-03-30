import { Text, YStack } from "tamagui";

export function ExperienceDescription() {
  return (
    <YStack gap={16} pb={32}>
      <Text fontSize={20} fontWeight="700" color="#2E2F2F">
        L'Expérience
      </Text>
      <Text fontSize={16} fontWeight="400" color="#5B5C5B" lineHeight={26}>
        Parcourez les sentiers escarpés face au massif du Mont-Blanc avec un guide naturaliste local. 
        Nous atteindrons le sommet pour savourer une sélection de fromages savoyards et du cidre artisanal 
        tout en admirant la vallée de Chamonix.
      </Text>
    </YStack>
  );
}
