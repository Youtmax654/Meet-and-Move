import React from 'react';
import { Button, H1, H4, Paragraph, SizableText, YStack } from 'tamagui';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

interface NotFoundErrorProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onPress?: () => void;
}

export function NotFoundError({
  title = "Oups ! Introuvable.",
  message = "Nous ne parvenons pas à trouver la page ou l'activité que vous recherchez.",
  buttonText = "Retour à l'accueil",
  onPress,
}: NotFoundErrorProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.replace('/');
    }
  };

  return (
    <YStack 
      flex={1} 
      alignItems="center" 
      justifyContent="center" 
      padding="$6" 
      gap="$6" 
      backgroundColor="#F7F6F5"
    >
      <YStack alignItems="center" gap="$2">
        <MaterialIcons name="search-off" size={100} color="#006666" style={{ opacity: 0.8 }} />
        <SizableText 
          size="$12" 
          fontWeight="900" 
          color="#006666" 
          letterSpacing={-2}
          marginTop="$4"
          opacity={0.8}
        >
          404
        </SizableText>
      </YStack>

      <YStack alignItems="center" gap="$2" paddingHorizontal="$4">
        <H4 textAlign="center" fontWeight="bold" color="#2E2F2F">{title}</H4>
        <Paragraph textAlign="center" color="#5B5C5B" size="$5" marginTop="$2">
          {message}
        </Paragraph>
      </YStack>

      <Button 
        backgroundColor="#006666" 
        size="$5" 
        borderRadius="$10" 
        pressStyle={{ opacity: 0.8, scale: 0.98 }}
        onPress={handlePress}
        paddingHorizontal="$8"
        marginTop="$4"
        shadowColor="rgba(0,0,0,0.1)"
        shadowRadius={10}
        shadowOffset={{ width: 0, height: 4 }}
      >
        <SizableText color="white" fontWeight="bold">
          {buttonText}
        </SizableText>
      </Button>
    </YStack>
  );
}
