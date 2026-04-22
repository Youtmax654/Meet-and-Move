import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import {
  ActivityForm,
  type ActivityFormValues,
} from "@/features/activities/components/ActivityForm";
import { api } from "@/lib/api";

export default function NewActivityScreen() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function submit(payload: ActivityFormValues) {
    setSubmitting(true);
    try {
      const res = await api.post("/activities", payload);
      const createdId = (res.data as any)?.id;
      Alert.alert("Activité publiée", "Ton activité a bien été créée.");
      if (createdId) {
        router.replace(`/experience/${createdId}`);
      } else {
        router.back();
      }
    } catch (e: any) {
      const message =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        "Impossible de publier l’activité.";
      Alert.alert("Erreur", message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: "Nouvelle Activité" }} />
      <ActivityForm
        submitLabel="Publier l’activité"
        submitting={submitting}
        onSubmit={submit}
      />
    </>
  );
}

