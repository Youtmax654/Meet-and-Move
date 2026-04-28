import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack } from "tamagui";

import { AutoValidateCard } from "@/features/activities/components/create/AutoValidateCard";
import { CreateActivityFooter } from "@/features/activities/components/create/CreateActivityFooter";
import { CreateActivityHeader } from "@/features/activities/components/create/CreateActivityHeader";
import { CreateActivityHero } from "@/features/activities/components/create/CreateActivityHero";
import { LocationDateSection } from "@/features/activities/components/create/LocationDateSection";
import { MainInfoSection } from "@/features/activities/components/create/MainInfoSection";
import { SettingsSection } from "@/features/activities/components/create/SettingsSection";
import {
  createActivity,
  type CreateActivityPayload,
} from "@/features/activities/activities.service";
import { useToast } from "@/context/toast-context";

const categoryOptions = [
  "Sport",
  "Voyage",
  "Gastronomie",
  "Culture",
  "Bien-etre",
];

const difficultyOptions = ["Facile", "Modere", "Intense"] as const;

type Difficulty = (typeof difficultyOptions)[number];

export default function CreateActivityScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("Modere");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [autoValidate, setAutoValidate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormReady = useMemo(
    () =>
      title.trim().length > 2 &&
      location.trim().length > 2 &&
      Boolean(eventDate),
    [title, location, eventDate],
  );

  const handleSubmit = async () => {
    if (!isFormReady || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload: CreateActivityPayload = {
        title: title.trim(),
        description: description.trim().length > 0 ? description.trim() : null,
        categoryId: null,
        locationCity: location.trim(),
        eventDate,
        auto_validate: autoValidate,
        duration_hours: toNullableNumber(duration),
        price: toNullableNumber(price),
        max_participants: toNullableNumber(maxParticipants),
        difficulty: mapDifficulty(difficulty),
      };

      const activity = await createActivity(payload);
      showToast("Activite publiee avec succes", "success");
      router.replace(`/experience/${activity.id}`);
    } catch (error) {
      console.error("Failed to create activity", error);
      showToast("Impossible de publier l'activite", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#F7F6F5" }}
        edges={["top", "left", "right"]}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          <YStack paddingTop={8} gap={20}>
            <CreateActivityHeader />
            <CreateActivityHero />
            <MainInfoSection
              title={title}
              description={description}
              categoryOptions={categoryOptions}
              category={category}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onCategoryChange={setCategory}
            />
            <LocationDateSection
              location={location}
              eventDate={eventDate}
              onLocationChange={setLocation}
              onEventDateChange={setEventDate}
            />
            <SettingsSection
              duration={duration}
              price={price}
              maxParticipants={maxParticipants}
              difficultyOptions={difficultyOptions}
              difficulty={difficulty}
              onDurationChange={setDuration}
              onPriceChange={setPrice}
              onMaxParticipantsChange={setMaxParticipants}
              onDifficultyChange={(value) => setDifficulty(value as Difficulty)}
            />
            <AutoValidateCard
              autoValidate={autoValidate}
              onAutoValidateChange={setAutoValidate}
            />
          </YStack>
        </ScrollView>
      </SafeAreaView>
      <CreateActivityFooter
        isFormReady={isFormReady}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </>
  );
}

function toNullableNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function mapDifficulty(value: Difficulty): string {
  switch (value) {
    case "Facile":
      return "easy";
    case "Intense":
      return "hard";
    default:
      return "medium";
  }
}
