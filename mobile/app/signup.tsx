import { useState } from "react";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, Text, TextArea, XStack, YStack } from "tamagui";
import { api } from "@/lib/api";

const genderOptions = [
  { label: "Homme", value: "male" },
  { label: "Femme", value: "female" },
  { label: "Autre", value: "other" },
];

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name.trim() || !birthDate || !gender) {
      setErrorMessage("Merci de completer tous les champs obligatoires.");
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      await api.patch("/users/me", {
        name: name.trim(),
        birthDate: birthDate.toISOString(),
        gender,
        image: image.trim() ? image.trim() : null,
        bio: bio.trim() ? bio.trim() : null,
      });

      router.replace("/(tabs)");
    } catch (error) {
      console.error(error);
      setErrorMessage("Impossible d'enregistrer votre profil.");
    } finally {
      setLoading(false);
    }
  };

  const formattedBirthDate = birthDate
    ? birthDate.toLocaleDateString("fr-FR")
    : "Sélectionner une date";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }}>
      <YStack flex={1} paddingHorizontal={20} paddingTop={32} gap={16}>
        <YStack gap={8} alignItems="center">
          <Text fontSize={28} fontWeight="800" color="#1E2228">
            Créer votre profil
          </Text>
          <Text fontSize={14} color="#5B5C5B" textAlign="center">
            Renseignez les informations demandées pour continuer.
          </Text>
        </YStack>

        <YStack gap={6}>
          <Text fontSize={14} color="#1E2228" fontWeight="600">
            Nom d&apos;utilisateur
          </Text>
          <Input
            placeholder="Votre nom"
            value={name}
            onChangeText={setName}
            backgroundColor="#FFFFFF"
            borderColor="#E2E2E1"
            height={50}
            disabled={loading}
          />
        </YStack>

        <YStack gap={6}>
          <Text fontSize={14} color="#1E2228" fontWeight="600">
            Date de naissance
          </Text>
          <Button
            backgroundColor="#FFFFFF"
            borderColor="#E2E2E1"
            borderWidth={1}
            height={50}
            justifyContent="flex-start"
            paddingHorizontal={14}
            onPress={() => setShowDatePicker(true)}
          >
            <Button.Text color="#1E2228">{formattedBirthDate}</Button.Text>
          </Button>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate ?? new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) {
                  setBirthDate(selectedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )}
        </YStack>

        <YStack gap={6}>
          <Text fontSize={14} color="#1E2228" fontWeight="600">
            Genre
          </Text>
          <XStack gap={10} flexWrap="wrap">
            {genderOptions.map((option) => {
              const isActive = gender === option.value;
              return (
                <Button
                  key={option.value}
                  height={40}
                  borderRadius={999}
                  paddingHorizontal={16}
                  backgroundColor={isActive ? "#006666" : "#FFFFFF"}
                  borderColor={isActive ? "#006666" : "#E2E2E1"}
                  borderWidth={1}
                  onPress={() => setGender(option.value)}
                >
                  <Button.Text color={isActive ? "#FFFFFF" : "#1E2228"}>
                    {option.label}
                  </Button.Text>
                </Button>
              );
            })}
          </XStack>
        </YStack>

        <YStack gap={6}>
          <Text fontSize={14} color="#1E2228" fontWeight="600">
            Photo (optionnel)
          </Text>
          <Input
            placeholder="Lien vers votre photo"
            value={image}
            onChangeText={setImage}
            backgroundColor="#FFFFFF"
            borderColor="#E2E2E1"
            height={50}
            disabled={loading}
          />
        </YStack>

        <YStack gap={6}>
          <Text fontSize={14} color="#1E2228" fontWeight="600">
            Bio (optionnel)
          </Text>
          <TextArea
            value={bio}
            onChangeText={setBio}
            placeholder="Parlez un peu de vous"
            backgroundColor="#FFFFFF"
            borderColor="#E2E2E1"
            minHeight={100}
            disabled={loading}
          />
        </YStack>

        {errorMessage && (
          <Text color="#B42318" textAlign="center">
            {errorMessage}
          </Text>
        )}

        <Button
          onPress={handleSubmit}
          disabled={loading}
          backgroundColor="#006666"
          borderRadius={14}
          height={52}
          pressStyle={{ opacity: 0.9 }}
        >
          <Button.Text color="#FFFFFF" fontWeight="700">
            Terminer l&apos;inscription
          </Button.Text>
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
