import { Button, View, XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

export function ActionBar() {
  return (
    <View
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      backgroundColor="#F7F6F5"
      paddingHorizontal={24}
      paddingTop={16}
      paddingBottom={32}
      shadowColor="#000"
      shadowOpacity={0.05}
      shadowRadius={10}
      elevation={10}
      borderTopColor="#EAEAEA"
      borderTopWidth={1}
    >
      <XStack gap={16} alignItems="center">
        <Button
          flex={1}
          backgroundColor="#006666"
          borderRadius={9999}
          height={56}
          pressStyle={{ scale: 0.98, opacity: 0.9 }}
        >
          <Text color="#FFFFFF" fontWeight="700" fontSize={16}>
            Rejoindre l'Équipe
          </Text>
        </Button>
        <Button
          width={56}
          height={56}
          borderRadius={28}
          borderWidth={0}
          backgroundColor="#E2E2E1"
          pressStyle={{ scale: 0.98, backgroundColor: "#D1D1D1" }}
        >
          <Ionicons name="heart-outline" size={24} color="#5B5C5B" />
        </Button>
      </XStack>
    </View>
  );
}
