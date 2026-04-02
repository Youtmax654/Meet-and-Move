import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Platform } from "react-native";
import { Button, Text, View, XStack, YStack } from "tamagui";
import { api } from "../../lib/api";
import * as SecureStore from 'expo-secure-store';

export function DebugUserPicker() {
  const [activeUser, setActiveUser] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Restaurer l'utilisateur actif au démarrage
    const restoreUser = async () => {
      try {
        let debugUserId = null;
        if (Platform.OS === 'web') {
          debugUserId = localStorage.getItem('debugUserId');
        } else {
          debugUserId = await SecureStore.getItemAsync('debugUserId');
        }

        if (debugUserId) {
          // On attend d'avoir chargé la liste des utilisateurs pour trouver l'objet complet
          if (users.length > 0) {
            const u = users.find(u => u.id === debugUserId);
            if (u) setActiveUser(u);
          }
        }
      } catch (err) {}
    };
    restoreUser();
  }, [users]);

  useEffect(() => {
    if (isOpen && users.length === 0) {
      setLoading(true);
      api.get('/auth/dev/users')
        .then((res) => {
          setUsers(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load users", err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  const selectUser = async (u: any | null) => {
    setActiveUser(u);
    setIsOpen(false);

    try {
      if (u) {
        if (Platform.OS === 'web') {
          localStorage.setItem('debugUserId', u.id);
        } else {
          await SecureStore.setItemAsync('debugUserId', u.id);
        }
      } else {
        if (Platform.OS === 'web') {
          localStorage.removeItem('debugUserId');
        } else {
          await SecureStore.deleteItemAsync('debugUserId');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Pressable
        style={styles.fab}
        onPress={() => setIsOpen(true)}
      >
        <Ionicons name="bug" size={24} color={activeUser ? "white" : "#666"} />
        {activeUser && (
          <View
            position="absolute"
            top={-2}
            right={-2}
            backgroundColor="#14B8A6"
            width={14}
            height={14}
            borderRadius={7}
            borderWidth={2}
            borderColor="#004D4D"
          />
        )}
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade">
        <View flex={1} backgroundColor="rgba(0,0,0,0.6)" justifyContent="center" alignItems="center" p="$4">
          <View backgroundColor="white" width="100%" maxHeight="80%" borderRadius={16} overflow="hidden">
            <XStack p="$4" justifyContent="space-between" alignItems="center" borderBottomWidth={1} borderColor="#eee">
              <Text fontWeight="bold" fontSize={18} color="#006666">Changer d'utilisateur (Debug)</Text>
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
                  <Text color={!activeUser ? "black" : "#6B7280"}>Non connecté</Text>
                </Button>

                {loading ? (
                  <Text textAlign="center" py="$4" color="#6B7280">Chargement...</Text>
                ) : (
                  users.map((u) => (
                    <Button
                      key={u.id}
                      backgroundColor={activeUser?.id === u.id ? "#CCFFFF" : "transparent"}
                      borderColor={activeUser?.id === u.id ? "#006666" : "#E5E7EB"}
                      borderWidth={1}
                      onPress={() => selectUser(u)}
                      justifyContent="flex-start"
                      py="$3"
                    >
                      <XStack alignItems="center" gap="$3">
                        <View width={40} height={40} borderRadius={20} backgroundColor="#F3F4F6" justifyContent="center" alignItems="center">
                          <Ionicons name="person" size={20} color="#9CA3AF" />
                        </View>
                        <YStack>
                          <Text fontWeight={activeUser?.id === u.id ? "800" : "normal"} color={activeUser?.id === u.id ? "#006666" : "black"}>{u.username}</Text>
                          <Text fontSize={12} color="#6B7280">{u.email}</Text>
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

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 120, // Haut au-dessus de la navbar
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#004D4D",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
});
