import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, View } from "tamagui";
import { Activity } from "../../types/activity";

export function HeroSection({ activity }: { activity?: Activity }) {
  return (
    <View position="relative" height={268.5} width="100%" borderRadius={12} overflow="hidden" backgroundColor="#E2E2E1">
      <Image
        source={{ uri: activity?.image || `https://loremflickr.com/800/600/nature?lock=1` }}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
      />
      <View
        position="absolute"
        bottom={24}
        left={24}
        flexDirection="row"
        alignItems="center"
        backgroundColor="rgba(156, 61, 42, 0.9)"
        borderRadius={30}
        px={16}
        py={6}
        gap={8}
      >
        <Ionicons name="shield-checkmark" size={14} color="#FFEFEC" />
        <Text
          fontSize={12}
          fontWeight="700"
          color="#FFEFEC"
          textTransform="uppercase"
          letterSpacing={0.5} // approximate 5%
        >
          Guide Local Vérifié
        </Text>
      </View>
    </View>
  );
}
