import React from "react";
import { Text, YStack } from "tamagui";

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

export function FormField({ label, children }: FormFieldProps) {
  return (
    <YStack gap={6}>
      <Text fontSize={12} color="#6B727B">
        {label}
      </Text>
      {children}
    </YStack>
  );
}
