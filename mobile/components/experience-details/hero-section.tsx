import { Image, View, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

export function HeroSection() {
  return (
    <View position="relative" height={268.5} width="100%" borderRadius={12} overflow="hidden">
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1550970144-7f15410db6ba?q=80&w=800&auto=format&fit=crop",
        }}
        width="100%"
        height="100%"
      />
      {/* Gradient overlay */}
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="50%"
        backgroundColor="rgba(0,0,0,0.4)"
      />
      
      {/* Badge: Guide Local Vérifié */}
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
