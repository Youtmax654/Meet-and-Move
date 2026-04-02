import { Platform } from 'react-native';
import { UpcomingActivity, TopRatedActivity, Guide } from '@/components/home/types';

// En mode web local, l'API est sur localhost, sinon on utilise la variable d'environnement (ou 10.0.2.2 pour Android)
const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:8787' 
  : (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:8787');

const FETCH_TIMEOUT = 5000;

async function fetchWithTimeout(url: string, timeoutMs = FETCH_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(`Timeout: ${url} n'a pas répondu en ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchActivities(): Promise<UpcomingActivity[]> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/feed`);

  if (!response.ok) {
    throw new Error(`Failed to fetch activities: ${response.status}`);
  }

  const data = await response.json();

  return data.map((item: any) => ({
    id: item.id || String(Math.random()),
    date: item.date || '',
    title: item.title || '',
    location: item.location || '',
    isHostVerified: item.isHostVerified ?? false,
    avatars: item.avatars || [],
    extra: item.extra != null ? String(item.extra) : '0',
    price: item.price || '0€',
    image: item.image || '',
  }));
}

export async function fetchTopRated(): Promise<TopRatedActivity[]> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/feed`);

  if (!response.ok) {
    throw new Error(`Failed to fetch top rated: ${response.status}`);
  }

  const data = await response.json();

  return data.slice(0, 3).map((item: any, index: number) => ({
    id: item.id || String(index),
    title: item.title || '',
    image: item.image || '',
    isFeatured: index === 0,
  }));
}

export async function fetchGuides(): Promise<Guide[]> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/feed/guides`);

  if (!response.ok) {
    throw new Error(`Failed to fetch guides: ${response.status}`);
  }

  const data = await response.json();

  return data.map((item: any) => ({
    id: item.id || String(Math.random()),
    name: item.name || '',
    details: item.details || '',
    image: item.image || '',
    isVerified: item.isVerified ?? false,
  }));
}
