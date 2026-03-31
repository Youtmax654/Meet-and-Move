import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React from "react";
import { Pressable } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // Use mapping to define icons for different tabs
  // Expo Router uses route names like 'index', 'activities', 'messages', 'profil'
  const getRouteInfo = (routeName: string) => {
    switch (routeName) {
      case "index":
        return { icon: "compass", label: "Explorer" };
      case "activities":
        return { icon: "layers", label: "Activités" };
      case "messages":
        return { icon: "chatbubble-ellipses", label: "Messages" };
      case "profil":
        return { icon: "person", label: "Profil" };
      default:
        // fallback to explore if 'explore' route exists
        if (routeName === "explore")
          return { icon: "compass", label: "Explorer" };
        return { icon: "ellipse", label: routeName };
    }
  };

  return (
    <View
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      style={{ elevation: 20 }}
      shadowColor="#000"
      shadowOpacity={0.06}
      shadowRadius={24}
      shadowOffset={{ width: 0, height: -8 }}
    >
      <BlurView
        intensity={40}
        tint="light"
        style={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflow: "hidden",
          backgroundColor: "rgb(247, 246, 245)",
          borderTopWidth: 1,
          borderTopColor: "rgba(226, 232, 240, 0.2)",
        }}
      >
        <XStack
          paddingTop={12}
          paddingBottom={24}
          paddingHorizontal={24}
          justifyContent="space-between"
          alignItems="stretch"
          gap={10}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const { icon, label } = getRouteInfo(route.name);

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={{
                  flex: 1,
                  borderRadius: 16,
                  backgroundColor: isFocused
                    ? "rgba(73, 83, 172, 0.1)"
                    : "transparent",
                }}
              >
                <YStack
                  flex={1}
                  paddingVertical={8}
                  paddingHorizontal={8}
                  alignItems="center"
                  justifyContent="center"
                  gap={4}
                >
                  <Ionicons
                    name={
                      isFocused ? (icon as any) : (`${icon}-outline` as any)
                    }
                    size={24}
                    color={isFocused ? "#4953AC" : "#64748B"}
                  />
                  <Text
                    fontSize={10}
                    fontWeight={isFocused ? "600" : "500"}
                    color={isFocused ? "#4953AC" : "#64748B"}
                    textTransform="uppercase"
                    letterSpacing={0.5}
                  >
                    {label}
                  </Text>
                </YStack>
              </Pressable>
            );
          })}
        </XStack>
      </BlurView>
    </View>
  );
}
