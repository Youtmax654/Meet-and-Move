import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Activity = {
  id: number;
  hostId: number;
  title: string;
  description?: string;
  categoryId?: number;
  maxParticipants?: number;
  autoValidate: boolean;
  eventDate?: string;
  createdAt: string;
};

type ParticipantStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
type ActivityParticipant = {
  activityId: number;
  userId: number;
  status: ParticipantStatus;
  joinedAt: string;
};

type ActivityDetailsResponse = {
  activity: Activity;
  participants: ActivityParticipant[];
  counts: { accepted: number; pending: number };
  myStatus: ParticipantStatus | null;
  chatId: number | null;
};

function getApiBaseUrl() {
  const env = process.env.EXPO_PUBLIC_API_URL;
  return env?.trim() ? env.trim().replace(/\/+$/, '') : 'http://localhost:8787';
}

const ME_USER_ID = 1; // MVP: remplacé par l’auth plus tard

export default function ActivityDetailsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const { id } = useLocalSearchParams<{ id: string }>();
  const activityId = Number(id);

  const [data, setData] = useState<ActivityDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [actingOn, setActingOn] = useState<number | null>(null);

  const isHost = data?.activity.hostId === ME_USER_ID;

  async function refresh() {
    if (!Number.isFinite(activityId)) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/activities/${activityId}?userId=${ME_USER_ID}`);
      const json = (await res.json()) as ActivityDetailsResponse;
      if (!res.ok) {
        Alert.alert('Erreur', (json as any)?.message ?? 'Impossible de charger l’activité.');
        return;
      }
      setData(json);
    } catch {
      Alert.alert('Erreur réseau', 'Vérifie que l’API tourne (npm run start:api).');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId]);

  async function join() {
    if (!Number.isFinite(activityId) || joining) return;
    setJoining(true);
    try {
      const res = await fetch(`${apiBaseUrl}/activities/${activityId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: ME_USER_ID }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        Alert.alert('Erreur', json?.message ?? 'Impossible de rejoindre.');
        return;
      }
      await refresh();
    } catch {
      Alert.alert('Erreur réseau', 'Vérifie que l’API tourne (npm run start:api).');
    } finally {
      setJoining(false);
    }
  }

  async function hostAction(userId: number, action: 'accept' | 'reject') {
    if (!Number.isFinite(activityId) || actingOn) return;
    setActingOn(userId);
    try {
      const res = await fetch(
        `${apiBaseUrl}/activities/${activityId}/participants/${userId}/${action}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hostId: ME_USER_ID }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        Alert.alert('Erreur', json?.message ?? 'Action impossible.');
        return;
      }
      await refresh();
    } catch {
      Alert.alert('Erreur réseau', 'Vérifie que l’API tourne (npm run start:api).');
    } finally {
      setActingOn(null);
    }
  }

  const pending = (data?.participants ?? []).filter((p) => p.status === 'pending');

  return (
    <>
      <Stack.Screen options={{ title: 'Détails activité' }} />
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Détails</ThemedText>
        {!Number.isFinite(activityId) ? (
          <ThemedText>Id invalide.</ThemedText>
        ) : loading && !data ? (
          <ThemedText>Chargement...</ThemedText>
        ) : !data ? (
          <ThemedText>Activité introuvable.</ThemedText>
        ) : (
          <>
            <ThemedView style={[styles.card, { borderColor: colors.icon }]}>
              <ThemedText type="subtitle">{data.activity.title}</ThemedText>
              {!!data.activity.description && <ThemedText>{data.activity.description}</ThemedText>}
              <ThemedText>
                Participants: <ThemedText type="defaultSemiBold">{data.counts.accepted}</ThemedText>
                {typeof data.activity.maxParticipants === 'number'
                  ? ` / ${data.activity.maxParticipants}`
                  : ''}
                {data.counts.pending ? ` (en attente: ${data.counts.pending})` : ''}
              </ThemedText>
              {data.activity.eventDate ? (
                <ThemedText>
                  Date: <ThemedText type="defaultSemiBold">{data.activity.eventDate}</ThemedText>
                </ThemedText>
              ) : null}
              {data.chatId ? (
                <ThemedText>
                  Chat groupe: <ThemedText type="defaultSemiBold">#{data.chatId}</ThemedText>
                </ThemedText>
              ) : null}
            </ThemedView>

            {!isHost ? (
              <ThemedView style={[styles.card, { borderColor: colors.icon }]}>
                <ThemedText type="subtitle">Rejoindre</ThemedText>
                <ThemedText>
                  Statut:{' '}
                  <ThemedText type="defaultSemiBold">{data.myStatus ?? 'non inscrit'}</ThemedText>
                </ThemedText>
                <Pressable
                  onPress={join}
                  disabled={joining || data.myStatus === 'pending' || data.myStatus === 'accepted'}
                  style={[
                    styles.cta,
                    {
                      backgroundColor:
                        joining || data.myStatus ? colors.tabIconDefault : colors.tint,
                    },
                  ]}
                >
                  <ThemedText style={styles.ctaText}>
                    {data.myStatus === 'accepted'
                      ? 'Déjà rejoint'
                      : data.myStatus === 'pending'
                        ? 'Demande envoyée'
                        : joining
                          ? 'Envoi...'
                          : 'Rejoindre'}
                  </ThemedText>
                </Pressable>
              </ThemedView>
            ) : (
              <ThemedView style={[styles.card, { borderColor: colors.icon }]}>
                <ThemedText type="subtitle">Demandes (organisateur)</ThemedText>
                {pending.length === 0 ? (
                  <ThemedText>Aucune demande en attente.</ThemedText>
                ) : (
                  pending.map((p) => (
                    <View key={p.userId} style={styles.pendingRow}>
                      <ThemedText>
                        User <ThemedText type="defaultSemiBold">#{p.userId}</ThemedText>
                      </ThemedText>
                      <View style={styles.actions}>
                        <Pressable
                          onPress={() => hostAction(p.userId, 'accept')}
                          disabled={actingOn === p.userId}
                          style={[styles.smallBtn, { borderColor: colors.tint }]}
                        >
                          <ThemedText style={{ color: colors.tint }}>Accepter</ThemedText>
                        </Pressable>
                        <Pressable
                          onPress={() => hostAction(p.userId, 'reject')}
                          disabled={actingOn === p.userId}
                          style={[styles.smallBtn, { borderColor: colors.icon }]}
                        >
                          <ThemedText>Refuser</ThemedText>
                        </Pressable>
                      </View>
                    </View>
                  ))
                )}
              </ThemedView>
            )}

            <Pressable onPress={refresh} style={[styles.refresh, { borderColor: colors.icon }]}>
              <ThemedText>Rafraîchir</ThemedText>
            </Pressable>
          </>
        )}
      </ScrollView>
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
  cta: {
    marginTop: 6,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: 'white',
    fontWeight: '700',
  },
  pendingRow: {
    paddingVertical: 8,
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  refresh: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
});

