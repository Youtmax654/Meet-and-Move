import { useEffect, useState } from 'react';

import { fetchActivities, fetchGuides, fetchTopRated } from '@/components/home/data/api';
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

        const [activitiesData, topRatedData, guidesData] = await Promise.all([
          fetchActivities(),
          fetchTopRated(),
          fetchGuides(),
        ]);

        if (!isMounted) return;

        if (activitiesData.length > 0) {
          setActivities(activitiesData);
        } else {
          setActivities(fallbackActivities);
        }

        if (topRatedData.length > 0) {
          setTopRated(topRatedData);
        } else {
          setTopRated(fallbackTopRated);
        }

        if (guidesData.length > 0) {
          setGuides(guidesData);
        } else {
          setGuides(fallbackGuides);
        }
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(message);
        console.warn('useHomeData: fallback sur données locales -', message);
        
        // Initialiser avec fallback local si échec de l'API
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
