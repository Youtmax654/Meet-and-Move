import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, Text } from 'tamagui';

export default function ProfilScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F6F5' }}>
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Text fontSize="$6" fontWeight="bold">Profil</Text>
      </YStack>
    </SafeAreaView>
  );
}
