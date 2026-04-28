import React from "react";
import { Button, Input, Text, TextArea, XStack, YStack } from "tamagui";
import { FormField } from "./FormField";

type MainInfoSectionProps = {
  title: string;
  description: string;
  categoryOptions: string[];
  category: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

export function MainInfoSection({
  title,
  description,
  categoryOptions,
  category,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
}: MainInfoSectionProps) {
  return (
    <YStack gap={12}>
      <Text fontSize={16} fontWeight="700" color="#1E2228">
        Informations principales
      </Text>
      <FormField label="Titre de l'activite">
        <Input
          value={title}
          onChangeText={onTitleChange}
          placeholder="Ex: Randonnee au coucher du soleil"
          backgroundColor="#FFFFFF"
          borderColor="#E5E5E3"
          focusStyle={{ borderColor: "#006666" }}
        />
      </FormField>

      <FormField label="Description">
        <TextArea
          value={description}
          onChangeText={onDescriptionChange}
          placeholder="Decris le programme, le niveau et l'ambiance."
          backgroundColor="#FFFFFF"
          borderColor="#E5E5E3"
          minHeight={110}
          focusStyle={{ borderColor: "#006666" }}
        />
      </FormField>

      <FormField label="Categorie">
        <XStack gap={8} flexWrap="wrap">
          {categoryOptions.map((option) => {
            const isActive = category === option;
            return (
              <Button
                key={option}
                height={36}
                borderRadius={999}
                paddingHorizontal={14}
                backgroundColor={isActive ? "#006666" : "#F1F1F0"}
                borderWidth={1}
                borderColor={isActive ? "#006666" : "#E2E2E1"}
                onPress={() => onCategoryChange(option)}
              >
                <Text
                  fontSize={12}
                  fontWeight="700"
                  color={isActive ? "#FFFFFF" : "#2E2F2F"}
                >
                  {option}
                </Text>
              </Button>
            );
          })}
        </XStack>
      </FormField>
    </YStack>
  );
}
