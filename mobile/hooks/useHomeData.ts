import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  nearbyGuides as fallbackGuides,
  upcomingActivities as fallbackActivities,
  weeklyTopRated as fallbackTopRated,
} from '@/components/home/data/homeData';
import { Guide, TopRatedActivity, UpcomingActivity } from '@/components/home/types';

type HomeData = {
  activities: UpcomingActivity[];
  topRated: TopRatedActivity[];
  guides: Guide[];
  loading: boolean;
  error: string | null;
};

export function useHomeData(): HomeData {
  const [activities, setActivities] = useState<UpcomingActivity[]>([]);
  const [topRated, setTopRated] = useState<TopRatedActivity[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch activities from real API
        // For topRated and guides, we keep fallbacks for now as they aren't implemented in back yet
        const response = await api.get('/feed');
        
        if (!isMounted) return;

        if (response.data && response.data.length > 0) {
          setActivities(response.data);
        } else {
          setActivities([]); // Empty state handled in UI
        }

        // Mocking others for now
        setTopRated(fallbackTopRated);
        setGuides(fallbackGuides);

      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(message);
        console.warn('useHomeData error:', message);
        
        // Final fallback to mock if API fails completely
        setActivities(fallbackActivities);
        setTopRated(fallbackTopRated);
        setGuides(fallbackGuides);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { activities, topRated, guides, loading, error };
}
