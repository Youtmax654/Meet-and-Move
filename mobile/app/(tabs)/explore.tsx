// @ts-nocheck
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Avatar,
  Button,
  Card,
  Image,
  Input,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.7;

export default function ExploreScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center" mb="$4">
          <XStack alignItems="center" gap="$2">
            <Ionicons name="location-outline" size={24} color="#006666" />
            <Text fontSize="$6" fontWeight="bold" color="#2E2F2F">
              Marseille, FR
            </Text>
          </XStack>
          <View
            w={40}
            h={40}
            borderRadius={20}
            backgroundColor="$gray3"
            alignItems="center"
            justifyContent="center"
          >
            <Ionicons name="notifications-outline" size={20} color="#2E2F2F" />
          </View>
        </XStack>

        {/* Title */}
        <YStack mb="$5">
          <Text
            fontSize={36}
            fontWeight="800"
            color="#2E2F2F"
            lineHeight={40}
            letterSpacing={-1}
          >
            Trouvez votre{"\n"}prochain voyage
          </Text>
        </YStack>

        {/* Search */}
        <View
          flexDirection="row"
          alignItems="center"
          backgroundColor="white"
          borderRadius={12}
          paddingHorizontal="$4"
          paddingVertical="$3"
          mb="$6"
          shadowColor="#000"
          shadowOffset={{ height: 2, width: 0 }}
          shadowOpacity={0.05}
          shadowRadius={4}
          elevation={2}
        >
          <Ionicons name="search" size={20} color="#808080" />
          <Input
            flex={1}
            borderWidth={0}
            backgroundColor="transparent"
            placeholder="Chercher une expérience, une activité, un souvenir..."
            placeholderTextColor="#808080"
            fontSize={14}
            ml="$2"
            p={0}
            focusStyle={{ outlineWidth: 0, borderWidth: 0 }}
          />
        </View>

        {/* Section 1: Activités à venir */}
        <XStack justifyContent="space-between" alignItems="center" mb="$4">
          <Text fontSize={20} fontWeight="bold" color="#2E2F2F">
            Activités à venir
          </Text>
          <Text fontSize={14} fontWeight="600" color="#006666">
            Voir tout
          </Text>
        </XStack>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 16,
            paddingBottom: 8,
            marginBottom: 24,
          }}
        >
          {/* Main Card */}
          <Card
            width={CARD_WIDTH}
            backgroundColor="white"
            borderRadius={24}
            overflow="hidden"
          >
            <View position="relative">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1550970144-7f15410db6ba?q=80&w=800&auto=format&fit=crop",
                }}
                width="100%"
                height={180}
              />
              <View
                position="absolute"
                top={12}
                left={12}
                backgroundColor="rgba(255,255,255,0.9)"
                borderRadius={16}
                px="$3"
                py="$1.5"
              >
                <Text fontSize={12} fontWeight="bold" color="#2E2F2F">
                  12 Oct
                </Text>
              </View>
            </View>
            <YStack padding="$4">
              <Text
                fontSize={18}
                fontWeight="bold"
                color="#2E2F2F"
                mb="$2"
                numberOfLines={2}
              >
                Randonnée sur la Crête du Mont-Blanc
              </Text>
              <XStack alignItems="center" gap="$1.5" mb="$4">
                <Ionicons name="checkmark-circle" size={16} color="#B33E2B" />
                <Text fontSize={14} color="#666">
                  Hôte : Elena K.
                </Text>
              </XStack>
              <XStack justifyContent="space-between" alignItems="flex-end">
                <XStack>
                  <Avatar
                    circular
                    size="$2.5"
                    borderColor="white"
                    borderWidth={2}
                    zIndex={3}
                  >
                    <Avatar.Image src="https://i.pravatar.cc/150?u=1" />
                  </Avatar>
                  <Avatar
                    circular
                    size="$2.5"
                    borderColor="white"
                    borderWidth={2}
                    marginLeft={-12}
                    zIndex={2}
                  >
                    <Avatar.Image src="https://i.pravatar.cc/150?u=2" />
                  </Avatar>
                  <View
                    width={28}
                    height={28}
                    borderRadius={14}
                    backgroundColor="#E5E5E5"
                    borderColor="white"
                    borderWidth={2}
                    marginLeft={-12}
                    zIndex={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={10} fontWeight="600" color="#666">
                      +5
                    </Text>
                  </View>
                </XStack>
                <YStack alignItems="flex-end">
                  <Text
                    fontSize={10}
                    fontWeight="bold"
                    color="#808080"
                    textTransform="uppercase"
                  >
                    A partir de
                  </Text>
                  <Text fontSize={22} fontWeight="bold" color="#006666">
                    55€
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          </Card>

          {/* Dummy Card 2 */}
          <Card
            width={CARD_WIDTH}
            backgroundColor="white"
            borderRadius={24}
            overflow="hidden"
          >
            <View position="relative">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
                }}
                width="100%"
                height={180}
              />
              <View
                position="absolute"
                top={12}
                left={12}
                backgroundColor="rgba(255,255,255,0.9)"
                borderRadius={16}
                px="$3"
                py="$1.5"
              >
                <Text fontSize={12} fontWeight="bold" color="#2E2F2F">
                  14 Oct
                </Text>
              </View>
            </View>
            <YStack padding="$4">
              <Text
                fontSize={18}
                fontWeight="bold"
                color="#2E2F2F"
                mb="$2"
                numberOfLines={2}
              >
                Atelier Poterie Locale
              </Text>
              <XStack alignItems="center" gap="$1.5" mb="$4">
                <Ionicons name="checkmark-circle" size={16} color="#B33E2B" />
                <Text fontSize={14} color="#666">
                  Hôte : Marc...
                </Text>
              </XStack>
              <XStack justifyContent="space-between" alignItems="flex-end">
                <XStack>
                  <Avatar
                    circular
                    size="$2.5"
                    borderColor="white"
                    borderWidth={2}
                    zIndex={3}
                  >
                    <Avatar.Image src="https://i.pravatar.cc/150?u=3" />
                  </Avatar>
                  <Avatar
                    circular
                    size="$2.5"
                    borderColor="white"
                    borderWidth={2}
                    marginLeft={-12}
                    zIndex={2}
                  >
                    <Avatar.Image src="https://i.pravatar.cc/150?u=4" />
                  </Avatar>
                  <View
                    width={28}
                    height={28}
                    borderRadius={14}
                    backgroundColor="#E5E5E5"
                    borderColor="white"
                    borderWidth={2}
                    marginLeft={-12}
                    zIndex={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={10} fontWeight="600" color="#666">
                      +2
                    </Text>
                  </View>
                </XStack>
                <YStack alignItems="flex-end">
                  <Text
                    fontSize={10}
                    fontWeight="bold"
                    color="#808080"
                    textTransform="uppercase"
                  >
                    A partir de
                  </Text>
                  <Text fontSize={22} fontWeight="bold" color="#006666">
                    35€
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          </Card>
        </ScrollView>

        {/* Section 2: Mieux notés cette semaine */}
        <Text fontSize={20} fontWeight="bold" color="#2E2F2F" mb="$4">
          Mieux notés cette semaine
        </Text>

        <YStack gap="$3" mb="$6">
          <View
            position="relative"
            height={160}
            width="100%"
            borderRadius={24}
            overflow="hidden"
          >
            <Image
              flex={1}
              source={{
                uri: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop",
              }}
              width="100%"
              height="100%"
            />
            <View
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              padding="$4"
              backgroundColor="rgba(0,0,0,0.4)"
            >
              <Text
                fontSize={10}
                fontWeight="bold"
                color="#A3C2C2"
                letterSpacing={1}
                mb="$1"
              >
                TENDANCE ACTUELLE
              </Text>
              <Text fontSize={18} fontWeight="bold" color="white">
                Dîner secret à Saint-Germain
              </Text>
            </View>
          </View>

          <XStack gap="$3" height={160}>
            <View
              flex={1}
              position="relative"
              borderRadius={24}
              overflow="hidden"
            >
              <Image
                flex={1}
                source={{
                  uri: "https://images.unsplash.com/photo-1516483638261-f40af5ffce50?q=80&w=600&auto=format&fit=crop",
                }}
                width="100%"
                height="100%"
              />
              <View
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                padding="$3"
                backgroundColor="rgba(0,0,0,0.4)"
              >
                <Text
                  fontSize={14}
                  fontWeight="bold"
                  color="white"
                  numberOfLines={2}
                >
                  Balade photo nocturne
                </Text>
              </View>
            </View>
            <View
              flex={1}
              position="relative"
              borderRadius={24}
              overflow="hidden"
            >
              <Image
                flex={1}
                source={{
                  uri: "https://images.unsplash.com/photo-1620054714470-43be0da6b856?q=80&w=600&auto=format&fit=crop",
                }}
                width="100%"
                height="100%"
              />
              <View
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                padding="$3"
                backgroundColor="rgba(0,0,0,0.4)"
              >
                <Text
                  fontSize={14}
                  fontWeight="bold"
                  color="white"
                  numberOfLines={2}
                >
                  Atelier Céramique
                </Text>
              </View>
            </View>
          </XStack>
        </YStack>

        {/* Section 3: Guides vérifiés près de chez vous */}
        <Text
          fontSize={20}
          fontWeight="bold"
          color="#2E2F2F"
          mb="$4"
          numberOfLines={2}
        >
          Guides vérifiés près de{"\n"}chez vous
        </Text>

        <YStack gap="$3">
          <View
            backgroundColor="white"
            borderRadius={24}
            p="$3"
            flexDirection="row"
            alignItems="center"
            shadowColor="#000"
            shadowOpacity={0.03}
            shadowRadius={8}
            elevation={1}
          >
            <View position="relative" mr="$3">
              <Avatar circular size="$5">
                <Avatar.Image src="https://i.pravatar.cc/150?u=5" />
              </Avatar>
              <View
                position="absolute"
                bottom={0}
                right={0}
                backgroundColor="white"
                borderRadius={10}
                p={2}
              >
                <Ionicons name="checkmark-circle" size={16} color="#B33E2B" />
              </View>
            </View>
            <YStack flex={1}>
              <Text fontSize={16} fontWeight="bold" color="#2E2F2F">
                Sarah Thompson
              </Text>
              <Text fontSize={13} color="#666" numberOfLines={2}>
                Experte en : Gastronomie, Histoire
              </Text>
            </YStack>
            <Button
              size="$3"
              backgroundColor="#006666"
              color="white"
              borderRadius={20}
              fontWeight="bold"
              fontSize={13}
            >
              Se connecter
            </Button>
          </View>

          <View
            backgroundColor="white"
            borderRadius={24}
            p="$3"
            flexDirection="row"
            alignItems="center"
            shadowColor="#000"
            shadowOpacity={0.03}
            shadowRadius={8}
            elevation={1}
          >
            <View position="relative" mr="$3">
              <Avatar circular size="$5">
                <Avatar.Image src="https://i.pravatar.cc/150?u=6" />
              </Avatar>
              <View
                position="absolute"
                bottom={0}
                right={0}
                backgroundColor="white"
                borderRadius={10}
                p={2}
              >
                <Ionicons name="checkmark-circle" size={16} color="#B33E2B" />
              </View>
            </View>
            <YStack flex={1}>
              <Text fontSize={16} fontWeight="bold" color="#2E2F2F">
                James Miller
              </Text>
              <Text fontSize={13} color="#666" numberOfLines={2}>
                Expert en : Vie nocturne, Musique
              </Text>
            </YStack>
            <Button
              size="$3"
              backgroundColor="#006666"
              color="white"
              borderRadius={20}
              fontWeight="bold"
              fontSize={13}
            >
              Se connecter
            </Button>
          </View>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
