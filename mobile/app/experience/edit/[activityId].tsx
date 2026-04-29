import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, Label, Text, View, XStack, YStack } from "tamagui";

import { NotFoundError } from "@/components/ui/not-found-error";
import { activityDetailsSchema } from "@/features/experience/schemas/activity-details.schema";
import { api } from "@/lib/api";
import type { Activity } from "@/types/activity";

export default function EditExperienceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.activityId as string; // Note: utilise activityId au lieu de id
  const queryClient = useQueryClient();

  // États locaux pour stocker temporairement les valeurs saisies par l'utilisateur avant sauvegarde
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [maxParticipantsError, setMaxParticipantsError] = useState<string | null>(null);
  const [durationHours, setDurationHours] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const {
    data: activity,
    isLoading,
    isError,
  } = useQuery<Activity, unknown>({
    queryKey: ["activity-details", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await api.get(`/activities/${id}`);
      return activityDetailsSchema.parse(response.data);
    },
  });

  // Dès que les données de l'activité sont récupérées du serveur, on pré-remplit les champs
  useEffect(() => {
    if (activity) {
      setDescription(activity.description || "");
      setMaxParticipants(activity.max_participants !== null && activity.max_participants !== undefined ? String(activity.max_participants) : "");
      setDurationHours(activity.duration_hours !== null && activity.duration_hours !== undefined ? String(activity.duration_hours) : "");
      setDifficulty(activity.difficulty || "");
    }
  }, [activity]);

  // Définition de l'action de mise à jour : on envoie une requête PATCH avec les nouvelles valeurs
  const updateMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await api.patch(`/activities/${id}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-details", id] });
      router.back();
    },
    onError: (err) => {
      console.error("Failed to update activity:", err);
      alert("Une erreur est survenue lors de la mise à jour.");
    },
  });

  // Fonction déclenchée lors de l'appui sur le bouton "Enregistrer"
  const handleSave = () => {
    setMaxParticipantsError(null); // On réinitialise l'erreur par défaut
    const newMaxParticipants = maxParticipants ? Number(maxParticipants) : null;

    // Validation : on s'assure qu'on ne puisse pas mettre un max inférieur au nombre actuel d'inscrits
    if (newMaxParticipants !== null && activity?.enrolledCount !== undefined) {
      if (newMaxParticipants < activity.enrolledCount) {
        setMaxParticipantsError(`Impossible : il y a déjà ${activity.enrolledCount} participant(s) inscrit(s).`);
        return; // On annule l'enregistrement si la condition n'est pas remplie
      }
    }

    // Si tout est bon, on lance la requête de mise à jour avec les valeurs formatées
    updateMutation.mutate({
      description: description || null,
      maxParticipants: newMaxParticipants,
      duration_hours: durationHours ? Number(durationHours) : null,
      difficulty: difficulty || null,
    });
  };

  if (isLoading) {
    return (
      <View flex={1} backgroundColor="#F7F6F5" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#006666" />
      </View>
    );
  }

  if (isError || !activity) {
    return (
      <NotFoundError
        title="Activité introuvable"
        message="L'activité que tu cherches n'existe pas ou a été supprimée."
        buttonText="Retour"
        onPress={() => router.back()}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }} edges={["top"]}>
        {/* Header */}
        <XStack
          paddingTop={16}
          paddingBottom={16}
          px="$4"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="#F7F6F5"
          borderBottomWidth={1}
          borderBottomColor="$gray4"
        >
          <Pressable onPress={() => router.back()}>
            <View width={40} height={40} borderRadius={20} alignItems="center" justifyContent="center">
              <Ionicons name="close" size={28} color="#006666" />
            </View>
          </Pressable>
          <Text fontWeight="800" color="#006666" fontSize={16}>
            Modifier l'activité
          </Text>
          <View width={40} />
        </XStack>

        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <YStack space="$4">
            <YStack space="$2">
              <Label fontWeight="bold" color="#006666">Description</Label>
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder="Décrivez votre activité..."
                backgroundColor="white"
                borderWidth={1}
                borderColor="$gray5"
                borderRadius="$4"
                multiline
                numberOfLines={4}
                paddingTop="$3"
              />
            </YStack>

            <YStack space="$2">
              <Label fontWeight="bold" color="#006666">Personnes (Max)</Label>
              <Input
                value={maxParticipants}
                onChangeText={(text) => {
                  setMaxParticipants(text);
                  if (maxParticipantsError) setMaxParticipantsError(null);
                }}
                keyboardType="numeric"
                placeholder="Ex: 10"
                backgroundColor="white"
                borderWidth={1}
                borderColor={maxParticipantsError ? "red" : "$gray5"}
                borderRadius="$4"
              />
              {maxParticipantsError && (
                <Text color="red" fontSize={12} mt="$1">
                  {maxParticipantsError}
                </Text>
              )}
            </YStack>

            <YStack space="$2">
              <Label fontWeight="bold" color="#006666">Durée (heures)</Label>
              <Input
                value={durationHours}
                onChangeText={setDurationHours}
                keyboardType="numeric"
                placeholder="Ex: 2"
                backgroundColor="white"
                borderWidth={1}
                borderColor="$gray5"
                borderRadius="$4"
              />
            </YStack>

            <YStack space="$2">
              <Label fontWeight="bold" color="#006666">Difficulté</Label>
              <Input
                value={difficulty}
                onChangeText={setDifficulty}
                placeholder="Ex: Débutant, Intermédiaire..."
                backgroundColor="white"
                borderWidth={1}
                borderColor="$gray5"
                borderRadius="$4"
              />
            </YStack>

            <Button
              mt="$6"
              backgroundColor="#006666"
              color="white"
              borderRadius="$10"
              fontWeight="bold"
              size="$5"
              onPress={handleSave}
              disabled={updateMutation.isPending}
              opacity={updateMutation.isPending ? 0.7 : 1}
            >
              {updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
