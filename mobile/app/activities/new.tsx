import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Stack } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type CreateActivityPayload = {
  hostId: number;
  title: string;
  description?: string;
  categoryId?: number;
  maxParticipants?: number;
  eventDate?: string;
};

function getApiBaseUrl() {
  const env = process.env.EXPO_PUBLIC_API_URL;
  return env?.trim() ? env.trim().replace(/\/+$/, '') : 'http://localhost:8787';
}

export default function NewActivityScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [maxParticipants, setMaxParticipants] = useState<string>('6');
  const [eventDate, setEventDate] = useState<string>(''); // ISO string
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = title.trim().length >= 2 && !submitting;

  async function onSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload: CreateActivityPayload = {
        hostId: 1,
        title: title.trim(),
        description: description.trim() ? description.trim() : undefined,
        categoryId,
        maxParticipants: Number.isFinite(Number(maxParticipants))
          ? Number(maxParticipants)
          : undefined,
        eventDate: eventDate.trim() ? eventDate.trim() : undefined,
      };

      const res = await fetch(`${apiBaseUrl}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        Alert.alert('Erreur', data?.message ?? 'Impossible de créer l’activité.');
        return;
      }

      Alert.alert('OK', `Activité créée (id: ${data?.id ?? '?'})`);
      setTitle('');
      setDescription('');
      setCategoryId(undefined);
      setEventDate('');
    } catch (e) {
      Alert.alert('Erreur réseau', 'Vérifie que l’API tourne (npm run start:api).');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Nouvelle Activité' }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title">Nouvelle Activité</ThemedText>
          <ThemedText>
            Renseigne les infos, puis publie. (API: <ThemedText type="defaultSemiBold">{apiBaseUrl}</ThemedText>)
          </ThemedText>

          <ThemedView style={[styles.card, { borderColor: colors.icon }]}>
            <ThemedText type="subtitle">Informations de base</ThemedText>

            <ThemedText type="defaultSemiBold">Titre</ThemedText>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Sortie skate entre potes"
              placeholderTextColor={colors.tabIconDefault}
              style={[
                styles.input,
                { borderColor: colors.icon, color: colors.text, backgroundColor: colors.background },
              ]}
            />

            <ThemedText type="defaultSemiBold">Description</ThemedText>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Décris rapidement l’activité..."
              placeholderTextColor={colors.tabIconDefault}
              multiline
              style={[
                styles.textarea,
                { borderColor: colors.icon, color: colors.text, backgroundColor: colors.background },
              ]}
            />

            <ThemedText type="defaultSemiBold">Catégorie (demo)</ThemedText>
            <View style={styles.chipsRow}>
              {[
                { id: 1, label: 'Sport' },
                { id: 2, label: 'Gastronomie' },
                { id: 3, label: 'Cinéma' },
                { id: 4, label: 'Culture' },
                { id: 5, label: 'Autre' },
              ].map((c) => {
                const selected = categoryId === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setCategoryId(selected ? undefined : c.id)}
                    style={[
                      styles.chip,
                      {
                        borderColor: selected ? colors.tint : colors.icon,
                        backgroundColor: selected ? `${colors.tint}22` : 'transparent',
                      },
                    ]}
                  >
                    <ThemedText style={{ color: selected ? colors.tint : colors.text }}>
                      {c.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </ThemedView>

          <ThemedView style={[styles.card, { borderColor: colors.icon }]}>
            <ThemedText type="subtitle">Taille de la Squad</ThemedText>
            <ThemedText type="defaultSemiBold">Max participants</ThemedText>
            <TextInput
              value={maxParticipants}
              onChangeText={setMaxParticipants}
              keyboardType="number-pad"
              placeholder="6"
              placeholderTextColor={colors.tabIconDefault}
              style={[
                styles.input,
                { borderColor: colors.icon, color: colors.text, backgroundColor: colors.background },
              ]}
            />
          </ThemedView>

          <ThemedView style={[styles.card, { borderColor: colors.icon }]}>
            <ThemedText type="subtitle">Date (ISO, optionnel)</ThemedText>
            <ThemedText type="defaultSemiBold">eventDate</ThemedText>
            <TextInput
              value={eventDate}
              onChangeText={setEventDate}
              placeholder="2026-03-31T18:30:00.000Z"
              placeholderTextColor={colors.tabIconDefault}
              autoCapitalize="none"
              style={[
                styles.input,
                { borderColor: colors.icon, color: colors.text, backgroundColor: colors.background },
              ]}
            />
          </ThemedView>

          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit}
            style={[
              styles.cta,
              {
                backgroundColor: canSubmit ? colors.tint : colors.tabIconDefault,
                opacity: submitting ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={styles.ctaText}>
              {submitting ? 'Publication...' : 'Publier l’activité'}
            </ThemedText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  cta: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: {
    color: 'white',
    fontWeight: '700',
  },
});

