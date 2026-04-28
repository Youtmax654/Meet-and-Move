import React from "react";
import { Button, Text, YStack } from "tamagui";

type CreateActivityFooterProps = {
  isFormReady: boolean;
  isSubmitting?: boolean;
  onSubmit?: () => void;
};

export function CreateActivityFooter({
  isFormReady,
  isSubmitting = false,
  onSubmit,
}: CreateActivityFooterProps) {
  const isDisabled = !isFormReady || isSubmitting;

  return (
    <YStack
      position="absolute"
      left={0}
      right={0}
      bottom={0}
      paddingHorizontal={16}
      paddingBottom={20}
      paddingTop={10}
      backgroundColor="#F7F6F5"
      borderTopWidth={1}
      borderTopColor="#E8E8E6"
    >
      <Button
        height={54}
        borderRadius={16}
        backgroundColor={isDisabled ? "#C7C7C5" : "#006666"}
        disabled={isDisabled}
        onPress={onSubmit}
      >
        <Text color="#FFFFFF" fontWeight="700" fontSize={16}>
          {isSubmitting ? "Publication..." : "Publier l'activité"}
        </Text>
      </Button>
    </YStack>
  );
}
