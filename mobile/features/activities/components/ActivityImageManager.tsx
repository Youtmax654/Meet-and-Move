import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { Button, Text, View, XStack, YStack } from "tamagui";

type PickerStatus = "idle" | "loading" | "success" | "error";

function dedupeAndLimit(images: string[], maxImages: number) {
  const unique = Array.from(new Set(images.filter(Boolean)));
  return unique.slice(0, maxImages);
}

export function ActivityImageManager({
  images,
  onChange,
  maxImages = 6,
  disabled = false,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}) {
  const [status, setStatus] = useState<PickerStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const canAddMore = images.length < maxImages;
  const remainingCount = useMemo(() => Math.max(0, maxImages - images.length), [images.length, maxImages]);

  function removePhoto(uri: string) {
    const next = images.filter((photoUri) => photoUri !== uri);
    onChange(next);
    setStatus("success");
    setStatusMessage("Photo supprimée.");
  }

  async function openGallery() {
    if (!canAddMore) return;
    setStatus("loading");
    setStatusMessage("Ouverture de la galerie...");

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setStatus("error");
      setStatusMessage("Permission galerie refusée.");
      Alert.alert("Permission requise", "Autorise l’accès à la galerie pour ajouter des photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remainingCount,
      quality: 0.85,
    });

    if (result.canceled) {
      setStatus("idle");
      setStatusMessage("");
      return;
    }

    const nextUris = result.assets?.map((asset) => asset.uri) ?? [];
    const merged = dedupeAndLimit([...images, ...nextUris], maxImages);
    onChange(merged);
    setStatus("success");
    setStatusMessage(`${nextUris.length} photo(s) ajoutée(s).`);
  }

  async function openCamera() {
    if (!canAddMore) return;
    setStatus("loading");
    setStatusMessage("Ouverture de la caméra...");

    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setStatus("error");
      setStatusMessage("Permission caméra refusée.");
      Alert.alert("Permission requise", "Autorise l’accès à la caméra pour prendre une photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });

    if (result.canceled) {
      setStatus("idle");
      setStatusMessage("");
      return;
    }

    const capturedUri = result.assets?.[0]?.uri;
    if (!capturedUri) {
      setStatus("error");
      setStatusMessage("Impossible de récupérer la photo.");
      return;
    }

    const merged = dedupeAndLimit([...images, capturedUri], maxImages);
    onChange(merged);
    setStatus("success");
    setStatusMessage("Photo ajoutée.");
  }

  return (
    <YStack
      backgroundColor="#FFFFFF"
      borderRadius={12}
      p={16}
      gap={12}
      shadowColor="#000"
      shadowOpacity={0.05}
      shadowRadius={2}
      shadowOffset={{ width: 0, height: 1 }}
      elevation={2}
    >
      <Text fontSize={18} fontWeight="800" color="#1E2228">
        Photos
      </Text>

      <XStack gap={10}>
        <Button
          flex={1}
          height={48}
          borderRadius={12}
          backgroundColor="#F1F1F0"
          color="#2E2F2F"
          borderWidth={1}
          borderColor="#E2E2E1"
          onPress={openGallery}
          disabled={disabled || !canAddMore || status === "loading"}
          icon={<Ionicons name="images-outline" size={18} color="#006666" />}
        >
          Galerie
        </Button>
        <Button
          flex={1}
          height={48}
          borderRadius={12}
          backgroundColor="#F1F1F0"
          color="#2E2F2F"
          borderWidth={1}
          borderColor="#E2E2E1"
          onPress={openCamera}
          disabled={disabled || !canAddMore || status === "loading"}
          icon={<Ionicons name="camera-outline" size={18} color="#006666" />}
        >
          Caméra
        </Button>
      </XStack>

      {status === "loading" ? (
        <XStack alignItems="center" gap={8}>
          <ActivityIndicator size="small" color="#006666" />
          <Text fontSize={13} color="#5B5C5B">
            {statusMessage || "Traitement des images..."}
          </Text>
        </XStack>
      ) : null}

      {status !== "loading" && statusMessage ? (
        <Text fontSize={13} color={status === "error" ? "#B42318" : "#006666"}>
          {statusMessage}
        </Text>
      ) : null}

      {images.length > 0 ? (
        <XStack flexWrap="wrap" gap={10}>
          {images.map((uri) => (
            <View
              key={uri}
              width={96}
              height={96}
              borderRadius={12}
              backgroundColor="#E2E2E1"
              overflow="hidden"
              borderWidth={1}
              borderColor="#E2E2E1"
              position="relative"
            >
              <Image
                source={{ uri }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={150}
              />
              <Button
                position="absolute"
                top={6}
                right={6}
                circular
                size="$2"
                backgroundColor="rgba(0,0,0,0.55)"
                onPress={() => removePhoto(uri)}
                disabled={disabled || status === "loading"}
                icon={<Ionicons name="trash-outline" size={14} color="#FFFFFF" />}
              />
            </View>
          ))}
        </XStack>
      ) : (
        <Text fontSize={13} color="#5B5C5B">
          Ajoute jusqu’à {maxImages} photos (preview avant publication).
        </Text>
      )}

      <Text fontSize={12} color="#8A8C8F">
        {images.length}/{maxImages} photos
      </Text>
    </YStack>
  );
}

