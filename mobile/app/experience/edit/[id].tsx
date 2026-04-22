import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { View } from "tamagui";

import { ActivityForm, type ActivityFormValues } from "@/features/activities/components/ActivityForm";
import { activityDetailsSchema } from "@/features/experience/schemas/activity-details.schema";
import { api } from "@/lib/api";
import { NotFoundError } from "@/components/ui/not-found-error";
import type { Activity } from "@/types/activity";

export default function EditActivityScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const [submitting, setSubmitting] = useState(false);

  const {
    data: activity,
    isLoading,
    isError,
    error,
  } = useQuery<Activity, unknown>({
    queryKey: ["activity-details", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await api.get(`/activities/${id}`);
      return activityDetailsSchema.parse(response.data);
    },
  });

  const errorMessage = (() => {
    if (!isError || !error) return null;
    if (error instanceof AxiosError && error.response?.status === 404) {
      return "Activité introuvable - 404";
    }
    if (
      error instanceof AxiosError &&
      typeof error.response?.data === "object" &&
      error.response?.data !== null &&
      "error" in error.response.data &&
      typeof (error.response.data as { error?: unknown }).error === "string"
    ) {
      return (error.response.data as { error: string }).error;
    }
    if (error instanceof Error) return error.message;
    return "Une erreur est survenue";
  })();

  async function submit(payload: ActivityFormValues) {
    if (!id) return;
    setSubmitting(true);
    try {
      await api.patch(`/activities/${id}`, payload);
      await queryClient.invalidateQueries({ queryKey: ["activity-details", id] });
      Alert.alert("Modifications publiées", "Ton activité a bien été mise à jour.");
      router.replace(`/experience/${id}`);
    } catch (e: any) {
      const message =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        "Impossible de publier les modifications.";
      Alert.alert("Erreur", message);
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <View flex={1} backgroundColor="#F7F6F5" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#006666" />
      </View>
    );
  }

  if (isError || !activity) {
    return (
      <>
        <Stack.Screen options={{ title: "Modifier Activité" }} />
        <NotFoundError
          title={errorMessage?.includes("404") ? "Activité introuvable" : "Erreur de chargement"}
          message={errorMessage || "Impossible de charger l’activité."}
          buttonText="Retour"
          onPress={() => router.back()}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Modifier Activité" }} />
      <ActivityForm
        initialActivity={activity}
        submitLabel="Publier les modifications"
        submitting={submitting}
        onSubmit={submit}
      />
    </>
  );
}

