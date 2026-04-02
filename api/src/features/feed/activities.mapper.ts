import { getActivityImageUrl, getAvatarUrl } from "../../utils/image";

export function mapActivityToCard(activity: any) {
  return {
    id: activity.id,

    image:
      activity.image ||
      getActivityImageUrl(activity.category?.name, activity.id),

    date: formatDate(activity.event_date),

    title: activity.title,

    location: formatLocation(activity.latitude, activity.longitude),

    isHostVerified: activity.isHostVerified,

    avatars: activity.participants
      ?.slice(0, 4)
      .map((p: any) => getAvatarUrl(p.id)),

    extra: Math.max(0, (activity.participants?.length || 0) - 4).toString(),

    price: activity.price ? `${activity.price}€` : "N/A",
  };
}

// ---------------- HELPERS ----------------

function formatDate(date: string | Date | null) {
  if (!date) return "Date à venir";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

function formatLocation(lat: number | string, lng: number | string) {
  // Optionnel: on pourrait utiliser un reverse geocoding plus tard
  return `Lyon, FR`;
}
