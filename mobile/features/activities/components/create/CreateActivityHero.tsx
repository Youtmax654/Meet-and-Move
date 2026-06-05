import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Text, YStack } from "tamagui";

type CreateActivityHeroProps = {
  coverImage: string | null;
  uploading: boolean;
  onPickImage: () => void;
};

export function CreateActivityHero({
  coverImage,
  uploading,
  onPickImage,
}: CreateActivityHeroProps) {
  return (
    <YStack
      backgroundColor="#FFFFFF"
      borderRadius={20}
      padding={16}
      gap={12}
      borderWidth={1}
      borderColor="#EFEFED"
    >
      <Text fontSize={22} fontWeight="800" color="#1E2228">
        Cree ton experience
      </Text>
      <Text fontSize={13} color="#5B5C5B">
        Donne envie a la communaute en soignant le titre, la date et le lieu.
      </Text>
      <YStack
        height={150}
        borderRadius={16}
        backgroundColor="#EDECEA"
        alignItems="center"
        justifyContent="center"
        gap={8}
        overflow="hidden"
        pressStyle={{ opacity: 0.85 }}
        onPress={uploading ? undefined : onPickImage}
      >
        {coverImage ? (
          <Image
            source={{ uri: coverImage }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : (
          <>
            <Ionicons name="image" size={28} color="#9B9B9A" />
            <Text fontSize={12} color="#6B727B">
              {uploading ? "Import en cours..." : "Ajouter une photo de couverture"}
            </Text>
          </>
        )}
      </YStack>
    </YStack>
  );
}
