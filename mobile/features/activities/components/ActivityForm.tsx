import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Alert, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, Text, View, XStack, YStack } from "tamagui";

import { PriceBreakdown } from "@/components/experience-details/price-breakdown";
import { ActivityImageManager } from "@/features/activities/components/ActivityImageManager";
import type { Activity, PriceBreakdownItem } from "@/types/activity";

type FormState = {
  title: string;
  categoryId: string;
  tags: string[];
  pricePerPerson: string;
  fees: string;
  maxParticipants: string;
  description: string;
  address: string;
  locationCity: string;
  latitude: string;
  longitude: string;
};

export type ActivityFormValues = {
  title: string;
  categoryId: string;
  tags: string[];
  description: string | null;
  maxParticipants: number;
  latitude: number | null;
  longitude: number | null;
  locationCity: string | null;
  address: string | null;
  pricePerPerson: number;
  fees: number;
  priceBreakdown: PriceBreakdownItem[];
  photos: string[];
  coverImage: string | null;
  platform: string;
};

const DEFAULT_BREAKDOWN_COLORS = ["#006666", "#4953AC", "#0E7C95", "#ADADAC"];

function toNumberOrNull(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function normalizeTag(tag: string) {
  const raw = tag.trim();
  if (!raw) return "";
  return raw.replace(/^#/, "").toLowerCase();
}

function inferPriceFieldsFromBreakdown(items?: PriceBreakdownItem[]) {
  const normalized = (items ?? []).map((i) => ({
    ...i,
    labelKey: i.label.trim().toLowerCase(),
  }));
  const pricePerPerson =
    normalized.find((i) => i.labelKey.includes("prix"))?.amount ?? 0;
  const fees = normalized.find((i) => i.labelKey.includes("frais"))?.amount ?? 0;
  return { pricePerPerson, fees };
}

export function ActivityForm({
  initialActivity,
  submitLabel,
  submitting,
  onSubmit,
}: {
  initialActivity?: Activity | null;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (payload: ActivityFormValues) => Promise<void> | void;
}) {
  const [tagDraft, setTagDraft] = useState("");

  const inferred = useMemo(() => {
    return inferPriceFieldsFromBreakdown(initialActivity?.price_breakdown);
  }, [initialActivity?.price_breakdown]);

  const [photos, setPhotos] = useState<string[]>(() => {
    const initialPhotos = initialActivity?.photos ?? [];
    if (initialPhotos.length > 0) return initialPhotos;
    if (initialActivity?.coverImage) return [initialActivity.coverImage];
    if (initialActivity?.image) return [initialActivity.image];
    return [];
  });

  const [form, setForm] = useState<FormState>({
    title: initialActivity?.title ?? "",
    categoryId: initialActivity?.category?.id ?? "",
    tags: (initialActivity?.tags ?? []).map(normalizeTag).filter(Boolean),
    pricePerPerson:
      typeof inferred.pricePerPerson === "number" && inferred.pricePerPerson > 0
        ? String(inferred.pricePerPerson)
        : "",
    fees: typeof inferred.fees === "number" && inferred.fees > 0 ? String(inferred.fees) : "",
    maxParticipants:
      typeof initialActivity?.max_participants === "number"
        ? String(initialActivity.max_participants)
        : "6",
    description: initialActivity?.description ?? "",
    address: initialActivity?.address ?? "",
    locationCity: initialActivity?.locationCity ?? "",
    latitude:
      typeof initialActivity?.latitude === "number" ? String(initialActivity.latitude) : "",
    longitude:
      typeof initialActivity?.longitude === "number" ? String(initialActivity.longitude) : "",
  });

  const pricePerPersonNumber = toNumberOrNull(form.pricePerPerson) ?? 0;
  const feesNumber = toNumberOrNull(form.fees) ?? 0;

  const priceBreakdown = useMemo<PriceBreakdownItem[]>(() => {
    const items: PriceBreakdownItem[] = [];
    items.push({
      label: "Prix par personne",
      amount: Math.max(0, pricePerPersonNumber),
      color: DEFAULT_BREAKDOWN_COLORS[0],
    });
    items.push({
      label: "Frais",
      amount: Math.max(0, feesNumber),
      color: DEFAULT_BREAKDOWN_COLORS[1],
    });
    return items;
  }, [pricePerPersonNumber, feesNumber]);

  const previewActivity = useMemo(() => {
    const total = pricePerPersonNumber + feesNumber;
    return {
      id: initialActivity?.id ?? "preview",
      title: form.title || "Activité",
      description: form.description || "",
      price: total,
      price_breakdown: priceBreakdown,
      max_participants: toNumberOrNull(form.maxParticipants) ?? 0,
      enrolledCount: initialActivity?.enrolledCount ?? 0,
      participants: initialActivity?.participants ?? [],
      host: initialActivity?.host ?? { id: "me", username: "Vous", avatar: "" },
      category: initialActivity?.category,
      photos,
      locationCity: form.locationCity || undefined,
      address: form.address || undefined,
      latitude: toNumberOrNull(form.latitude) ?? undefined,
      longitude: toNumberOrNull(form.longitude) ?? undefined,
    } satisfies Partial<Activity>;
  }, [
    initialActivity,
    form.title,
    form.description,
    form.maxParticipants,
    form.locationCity,
    form.address,
    form.latitude,
    form.longitude,
    photos,
    priceBreakdown,
    pricePerPersonNumber,
    feesNumber,
  ]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addTag() {
    const normalized = normalizeTag(tagDraft);
    if (!normalized) return;
    setForm((prev) => {
      if (prev.tags.includes(normalized)) return prev;
      return { ...prev, tags: [...prev.tags, normalized] };
    });
    setTagDraft("");
  }

  function removeTag(tag: string) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }

  function validate() {
    if (!form.title.trim()) return "Le titre est obligatoire.";
    if (!form.categoryId.trim()) return "La catégorie est obligatoire.";
    const mp = toNumberOrNull(form.maxParticipants);
    if (mp === null || mp <= 0 || !Number.isInteger(mp)) {
      return "Le nombre de participants doit être un entier positif.";
    }
    if (!form.address.trim() && !form.locationCity.trim()) {
      return "Le lieu (adresse ou ville) est obligatoire.";
    }
    const p = toNumberOrNull(form.pricePerPerson);
    if (p === null || p < 0) return "Le prix par personne est invalide.";
    const f = toNumberOrNull(form.fees);
    if (f === null || f < 0) return "Les frais sont invalides.";
    return null;
  }

  async function submit() {
    const error = validate();
    if (error) {
      Alert.alert("Champs manquants", error);
      return;
    }

    const maxParticipants = toNumberOrNull(form.maxParticipants) ?? 0;
    const latitude = toNumberOrNull(form.latitude);
    const longitude = toNumberOrNull(form.longitude);

    const payload: ActivityFormValues = {
      title: form.title.trim(),
      categoryId: form.categoryId.trim(),
      tags: form.tags,
      description: form.description.trim() || null,
      maxParticipants,
      latitude,
      longitude,
      locationCity: form.locationCity.trim() || null,
      address: form.address.trim() || null,
      pricePerPerson: toNumberOrNull(form.pricePerPerson) ?? 0,
      fees: toNumberOrNull(form.fees) ?? 0,
      priceBreakdown,
      photos,
      coverImage: photos[0] ?? null,
      platform: Platform.OS,
    };

    await onSubmit(payload);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack gap={16}>
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
              Détails
            </Text>

            <YStack gap={8}>
              <Text fontSize={12} fontWeight="700" color="#5B5C5B" textTransform="uppercase" letterSpacing={0.8}>
                Titre *
              </Text>
              <Input
                value={form.title}
                onChangeText={(v) => set("title", v)}
                placeholder="Ex: Running au coucher du soleil"
                backgroundColor="#FFFFFF"
                borderColor="#E2E2E1"
                borderWidth={1}
                borderRadius={12}
                height={48}
                color="#2E2F2F"
                placeholderTextColor="#ADADAC"
                focusStyle={{ outlineWidth: 0, borderColor: "#006666" }}
              />
            </YStack>

            <YStack gap={8}>
              <Text fontSize={12} fontWeight="700" color="#5B5C5B" textTransform="uppercase" letterSpacing={0.8}>
                Catégorie (ID) *
              </Text>
              <Input
                value={form.categoryId}
                onChangeText={(v) => set("categoryId", v)}
                placeholder="UUID de la catégorie (interest)"
                backgroundColor="#FFFFFF"
                borderColor="#E2E2E1"
                borderWidth={1}
                borderRadius={12}
                height={48}
                color="#2E2F2F"
                placeholderTextColor="#ADADAC"
                autoCapitalize="none"
                focusStyle={{ outlineWidth: 0, borderColor: "#006666" }}
              />
            </YStack>

            <YStack gap={8}>
              <Text fontSize={12} fontWeight="700" color="#5B5C5B" textTransform="uppercase" letterSpacing={0.8}>
                Tags
              </Text>
              <XStack gap={8} alignItems="center">
                <Input
                  flex={1}
                  value={tagDraft}
                  onChangeText={setTagDraft}
                  placeholder="Ex: sport"
                  backgroundColor="#FFFFFF"
                  borderColor="#E2E2E1"
                  borderWidth={1}
                  borderRadius={12}
                  height={48}
                  color="#2E2F2F"
                  placeholderTextColor="#ADADAC"
                  autoCapitalize="none"
                  onSubmitEditing={addTag}
                  returnKeyType="done"
                  focusStyle={{ outlineWidth: 0, borderColor: "#006666" }}
                />
                <Button
                  height={48}
                  borderRadius={12}
                  backgroundColor="#006666"
                  onPress={addTag}
                  icon={<Ionicons name="add" size={18} color="#FFFFFF" />}
                />
              </XStack>
              {form.tags.length > 0 ? (
                <XStack flexWrap="wrap" gap={8}>
                  {form.tags.map((t) => (
                    <Button
                      key={t}
                      height={32}
                      borderRadius={9999}
                      backgroundColor="#F1F1F0"
                      color="#2E2F2F"
                      onPress={() => removeTag(t)}
                      icon={<Ionicons name="close" size={14} color="#5B5C5B" />}
                    >
                      #{t}
                    </Button>
                  ))}
                </XStack>
              ) : null}
            </YStack>

            <YStack gap={8}>
              <Text fontSize={12} fontWeight="700" color="#5B5C5B" textTransform="uppercase" letterSpacing={0.8}>
                Description
              </Text>
              <Input
                value={form.description}
                onChangeText={(v) => set("description", v)}
                placeholder="Décris l’activité, le niveau, le déroulé..."
                backgroundColor="#FFFFFF"
                borderColor="#E2E2E1"
                borderWidth={1}
                borderRadius={12}
                minHeight={96}
                multiline
                textAlignVertical="top"
                color="#2E2F2F"
                placeholderTextColor="#ADADAC"
                focusStyle={{ outlineWidth: 0, borderColor: "#006666" }}
              />
            </YStack>
          </YStack>

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
              Lieu *
            </Text>

            <YStack gap={8}>
              <Text fontSize={12} fontWeight="700" color="#5B5C5B" textTransform="uppercase" letterSpacing={0.8}>
                Adresse
              </Text>
              <Input
                value={form.address}
                onChangeText={(v) => set("address", v)}
                placeholder="Ex: 12 rue de la Paix"
                backgroundColor="#FFFFFF"
                borderColor="#E2E2E1"
                borderWidth={1}
                borderRadius={12}
                height={48}
                color="#2E2F2F"
                placeholderTextColor="#ADADAC"
                focusStyle={{ outlineWidth: 0, borderColor: "#006666" }}
              />
            </YStack>

            <YStack gap={8}>
              <Text fontSize={12} fontWeight="700" color="#5B5C5B" textTransform="uppercase" letterSpacing={0.8}>
                Ville
              </Text>
              <Input
                value={form.locationCity}
                onChangeText={(v) => set("locationCity", v)}
                placeholder="Ex: Marseille"
                backgroundColor="#FFFFFF"
                borderColor="#E2E2E1"
                borderWidth={1}
                borderRadius={12}
                height={48}
                color="#2E2F2F"
                placeholderTextColor="#ADADAC"
                focusStyle={{ outlineWidth: 0, borderColor: "#006666" }}
              />
            </YStack>

            <XStack gap={12}>
              <YStack flex={1} gap={8}>
                <Text fontSize={12} fontWeight="700" color="#5B5C5B" textTransform="uppercase" letterSpacing={0.8}>
                  Latitude
                </Text>
                <Input
                  value={form.latitude}
                  onChangeText={(v) => set("latitude", v)}
                  placeholder="43.2965"
                  keyboardType="numeric"
                  backgroundColor="#FFFFFF"
                  borderColor="#E2E2E1"
                  borderWidth={1}
                  borderRadius={12}
                  height={48}
                  color="#2E2F2F"
                  placeholderTextColor="#ADADAC"
                  focusStyle={{ outlineWidth: 0, borderColor: "#006666" }}
                />
              </YStack>
              <YStack flex={1} gap={8}>
                <Text fontSize={12} fontWeight="700" color="#5B5C5B" textTransform="uppercase" letterSpacing={0.8}>
                  Longitude
                </Text>
                <Input
                  value={form.longitude}
                  onChangeText={(v) => set("longitude", v)}
                  placeholder="5.3698"
                  keyboardType="numeric"
                  backgroundColor="#FFFFFF"
                  borderColor="#E2E2E1"
                  borderWidth={1}
                  borderRadius={12}
                  height={48}
                  color="#2E2F2F"
                  placeholderTextColor="#ADADAC"
                  focusStyle={{ outlineWidth: 0, borderColor: "#006666" }}
                />
              </YStack>
            </XStack>
          </YStack>

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
              Prix & Transparence
            </Text>

            <XStack gap={12}>
              <YStack flex={1} gap={8}>
                <Text fontSize={12} fontWeight="700" color="#5B5C5B" textTransform="uppercase" letterSpacing={0.8}>
                  Prix par personne *
                </Text>
                <Input
                  value={form.pricePerPerson}
                  onChangeText={(v) => set("pricePerPerson", v)}
                  placeholder="Ex: 12"
                  keyboardType="numeric"
                  backgroundColor="#FFFFFF"
                  borderColor="#E2E2E1"
                  borderWidth={1}
                  borderRadius={12}
                  height={48}
                  color="#2E2F2F"
                  placeholderTextColor="#ADADAC"
                  focusStyle={{ outlineWidth: 0, borderColor: "#006666" }}
                />
              </YStack>

              <YStack flex={1} gap={8}>
                <Text fontSize={12} fontWeight="700" color="#5B5C5B" textTransform="uppercase" letterSpacing={0.8}>
                  Frais *
                </Text>
                <Input
                  value={form.fees}
                  onChangeText={(v) => set("fees", v)}
                  placeholder="Ex: 1.50"
                  keyboardType="numeric"
                  backgroundColor="#FFFFFF"
                  borderColor="#E2E2E1"
                  borderWidth={1}
                  borderRadius={12}
                  height={48}
                  color="#2E2F2F"
                  placeholderTextColor="#ADADAC"
                  focusStyle={{ outlineWidth: 0, borderColor: "#006666" }}
                />
              </YStack>
            </XStack>

            <PriceBreakdown activity={previewActivity as any} />
          </YStack>

          <ActivityImageManager images={photos} onChange={setPhotos} disabled={Boolean(submitting)} />

          <YStack backgroundColor="#F1F1F0" borderRadius={12} p={16} gap={12} mb={8}>
            <XStack alignItems="center" justifyContent="space-between">
              <Text fontSize={18} fontWeight="800" color="#2E2F2F">
                Tableau Squad
              </Text>
              <Text fontSize={14} fontWeight="700" color="#006666">
                {(initialActivity?.enrolledCount ?? 0)}/{toNumberOrNull(form.maxParticipants) ?? 0} places
              </Text>
            </XStack>

            <YStack gap={8}>
              <Text fontSize={12} fontWeight="700" color="#5B5C5B" textTransform="uppercase" letterSpacing={0.8}>
                Nombre de participants *
              </Text>
              <XStack gap={10} alignItems="center">
                <Button
                  circular
                  size="$4"
                  backgroundColor="#FFFFFF"
                  borderWidth={1}
                  borderColor="#E2E2E1"
                  onPress={() => {
                    const curr = toNumberOrNull(form.maxParticipants) ?? 1;
                    const next = Math.max(1, curr - 1);
                    set("maxParticipants", String(next));
                  }}
                  icon={<Ionicons name="remove" size={18} color="#2E2F2F" />}
                />
                <Input
                  flex={1}
                  value={form.maxParticipants}
                  onChangeText={(v) => set("maxParticipants", v)}
                  keyboardType="numeric"
                  backgroundColor="#FFFFFF"
                  borderColor="#E2E2E1"
                  borderWidth={1}
                  borderRadius={12}
                  height={48}
                  color="#2E2F2F"
                  placeholderTextColor="#ADADAC"
                  focusStyle={{ outlineWidth: 0, borderColor: "#006666" }}
                />
                <Button
                  circular
                  size="$4"
                  backgroundColor="#FFFFFF"
                  borderWidth={1}
                  borderColor="#E2E2E1"
                  onPress={() => {
                    const curr = toNumberOrNull(form.maxParticipants) ?? 1;
                    const next = Math.min(99, curr + 1);
                    set("maxParticipants", String(next));
                  }}
                  icon={<Ionicons name="add" size={18} color="#2E2F2F" />}
                />
              </XStack>
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#F7F6F5" }}>
        <View
          paddingHorizontal={16}
          paddingTop={10}
          paddingBottom={10}
          borderTopWidth={1}
          borderTopColor="#E2E2E1"
          backgroundColor="#F7F6F5"
        >
          <Button
            height={52}
            borderRadius={16}
            backgroundColor="#006666"
            color="#FFFFFF"
            fontWeight="800"
            onPress={submit}
            disabled={Boolean(submitting)}
            icon={<Ionicons name="rocket-outline" size={18} color="#FFFFFF" />}
          >
            {submitting ? "Enregistrement..." : submitLabel}
          </Button>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

