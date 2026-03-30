import { Stack, useRouter } from "expo-router";
import { ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

import { HeroSection } from "../../components/experience-details/hero-section";
import { ExperienceHeader } from "../../components/experience-details/experience-header";
import { ExperienceDescription } from "../../components/experience-details/experience-description";
import { SquadMembers } from "../../components/experience-details/squad-members";
import { PriceBreakdown } from "../../components/experience-details/price-breakdown";
import { ActionBar } from "../../components/experience-details/action-bar";

export default function ExperienceDetailsScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }} edges={['top']}>
        {/* Top App Bar - Solid background instead of transparent */}
        <XStack 
          position="absolute" 
          top={0}
          left={0} 
          right={0} 
          paddingTop={56} // Approximate safe area padding
          paddingBottom={16}
          px="$4" 
          alignItems="center" 
          zIndex={10} 
          justifyContent="space-between"
          backgroundColor="#F7F6F5" 
        >
          <Pressable onPress={() => router.back()}>
            <View 
              width={40} 
              height={40} 
              borderRadius={20} 
              alignItems="center" 
              justifyContent="center"
            >
              <Ionicons name="chevron-back" size={24} color="#006666" />
            </View>
          </Pressable>

          <Text fontWeight="800" color="#006666" fontSize={16}>Chamonix, FR</Text>
          
          <View width={40} /> {/* spacer balancing the back nav button */}
        </XStack>

        <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: 100 }} showsVerticalScrollIndicator={false}>
          <View px={24} pt="$4">
            <HeroSection />
            <ExperienceHeader />
            <ExperienceDescription />
            <SquadMembers />
            <PriceBreakdown />
          </View>
        </ScrollView>

        <ActionBar />
      </SafeAreaView>
    </>
  );
}
