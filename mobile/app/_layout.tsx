import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";
import { config } from "../tamagui.config";
import { DebugUserPicker } from "../components/debug/debug-user-picker";
import { DevUserProvider } from "../context/dev-user-context";
import { ToastProvider } from "../context/toast-context";

import { useDevUser } from "../context/dev-user-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const { activeUser } = useDevUser();
  
  return (
    <>
      <Stack key={activeUser?.id}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="experience/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <DebugUserPicker />
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ToastProvider>
          <DevUserProvider>
            <RootLayoutContent />
          </DevUserProvider>
        </ToastProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
