import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  DevSettings,
  Modal,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { Button, Text, View, XStack, YStack } from "tamagui";
import { api } from "../../lib/api";

type DebugUser = {
  id: string;
  username: string;
  email: string;
};

// TODO: To replace with a real authentication flow.
export function DebugUserPicker() {
  const [activeUser, setActiveUser] = useState<DebugUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<DebugUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Restore the active user on startup
    const restoreUser = async () => {
      try {
        let debugUserId = null;
        if (Platform.OS === "web") {
          debugUserId = localStorage.getItem("debugUserId");
        } else {
          debugUserId = await SecureStore.getItemAsync("debugUserId");
        }

        if (debugUserId && users.length > 0) {
          const u = users.find((u) => u.id === debugUserId);
          if (u) setActiveUser(u);
        }
      } catch (err) {
        console.error("Failed to restore user", err);
      }
    };
    restoreUser();
  }, [users]);

  useEffect(() => {
    if (users.length > 0) return;

    setLoading(true);
    api
      .get("/auth/dev/users")
      .then((res) => {
        setUsers(res.data as DebugUser[]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load users", err);
        setLoading(false);
      });
  }, [users.length]);

  const selectUser = async (u: DebugUser | null) => {
    setActiveUser(u);
    setIsOpen(false);

    try {
      if (u) {
        if (Platform.OS === "web") {
          localStorage.setItem("debugUserId", u.id);
        } else {
          await SecureStore.setItemAsync("debugUserId", u.id);
        }
      } else {
        if (Platform.OS === "web") {
          localStorage.removeItem("debugUserId");
        } else {
          await SecureStore.deleteItemAsync("debugUserId");
        }
      }

      // Reload the app to apply the change globally
      if (Platform.OS === "web") {
        window.location.reload();
      } else if (__DEV__) {
        DevSettings.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button
        position="absolute"
        right={16}
        top="50%"
        y={-24}
        width={48}
        height={48}
        borderRadius={24}
        padding={0}
        backgroundColor="#004D4D"
        justifyContent="center"
        alignItems="center"
        zIndex={9999}
        elevation={8}
        shadowColor="#000"
        shadowOpacity={0.3}
        shadowOffset={{ width: 0, height: 4 }}
        shadowRadius={6}
        onPress={() => setIsOpen(true)}
        icon={
          <Ionicons
            name="bug"
            size={24}
            color={activeUser ? "white" : "#666"}
          />
        }
      >
        {activeUser && (
          <View
            position="absolute"
            top={0}
            right={0}
            backgroundColor="#14B8A6"
            width={14}
            height={14}
            borderRadius={7}
            borderWidth={2}
            borderColor="#004D4D"
          />
        )}
      </Button>

      <Modal visible={isOpen} transparent animationType="fade">
        <View
          flex={1}
          backgroundColor="rgba(0,0,0,0.6)"
          justifyContent="center"
          alignItems="center"
          p="$4"
        >
          <View
            backgroundColor="white"
            width="100%"
            maxHeight="80%"
            borderRadius={16}
            overflow="hidden"
          >
            <XStack
              p="$4"
              justifyContent="space-between"
              alignItems="center"
              borderBottomWidth={1}
              borderColor="#eee"
            >
              <Text fontWeight="bold" fontSize={18} color="#006666">
                Changer d&apos;utilisateur (Debug)
              </Text>
              <Pressable onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="black" />
              </Pressable>
            </XStack>

            <ScrollView>
              <YStack p="$4" gap="$3">
                <Button
                  backgroundColor={!activeUser ? "#E5E7EB" : "transparent"}
                  borderColor={!activeUser ? "#9CA3AF" : "#E5E7EB"}
                  borderWidth={1}
                  onPress={() => selectUser(null)}
                >
                  <Text color={!activeUser ? "black" : "#6B7280"}>
                    Non connecté
                  </Text>
                </Button>

                {loading ? (
                  <Text textAlign="center" py="$4" color="#6B7280">
                    Chargement...
                  </Text>
                ) : (
                  users.map((u) => (
                    <Button
                      key={u.id}
                      backgroundColor={
                        activeUser?.id === u.id ? "#CCFFFF" : "transparent"
                      }
                      borderColor={
                        activeUser?.id === u.id ? "#006666" : "#E5E7EB"
                      }
                      borderWidth={1}
                      onPress={() => selectUser(u)}
                      justifyContent="flex-start"
                      py="$3"
                    >
                      <XStack alignItems="center" gap="$3">
                        <View
                          width={40}
                          height={40}
                          borderRadius={20}
                          backgroundColor="#F3F4F6"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Ionicons name="person" size={20} color="#9CA3AF" />
                        </View>
                        <YStack>
                          <Text
                            fontWeight={
                              activeUser?.id === u.id ? "800" : "normal"
                            }
                            color={
                              activeUser?.id === u.id ? "#006666" : "black"
                            }
                          >
                            {u.username}
                          </Text>
                          <Text fontSize={12} color="#6B7280">
                            {u.email}
                          </Text>
                        </YStack>
                      </XStack>
                    </Button>
                  ))
                )}
              </YStack>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
