import { Activity } from "@/components/home/types";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type HomeData = {
  activities: Activity[];
  loading: boolean;
  error: string | null;
};

export function useHomeData(): HomeData {
  const [activities, setActivities] = useState<Activity[]>([]);
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
        const response = await api.get("/feed");

        if (!isMounted) return;

        if (response.data && response.data.length > 0) {
          setActivities(response.data);
        } else {
          setActivities([]); // Empty state handled in UI
        }
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError(message);
        console.warn("useHomeData error:", message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { activities, loading, error };
}
