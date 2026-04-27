import { getPublicUrl } from "../lib/storage";

function isHttpUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

/**
 * Rétrocompatibilité:
 * - anciennes données: avatar = pravatar (id user)
 * - nouvelles données: avatarKey (ex: "avatars/<id>.jpg") stockée en DB
 * - si l'app stocke déjà une URL complète, on la renvoie telle quelle
 */
export function getAvatarUrl(idOrKeyOrUrl: string) {
  if (!idOrKeyOrUrl) return "";
  if (isHttpUrl(idOrKeyOrUrl)) return idOrKeyOrUrl;
  if (idOrKeyOrUrl.includes("/")) return getPublicUrl(idOrKeyOrUrl);
  return `https://i.pravatar.cc/150?u=${idOrKeyOrUrl}`;
}

/**
 * Rétrocompatibilité:
 * - si `imageKeyOrUrl` est une URL: on la renvoie telle quelle
 * - si c'est une clé MinIO: on construit l'URL publique via getPublicUrl()
 * - sinon: fallback loremflickr basé sur (category, activityId)
 */
export function getActivityImageUrl(
  categoryName?: string,
  activityId?: string,
  imageKeyOrUrl?: string | null,
) {
  if (imageKeyOrUrl) {
    if (isHttpUrl(imageKeyOrUrl)) return imageKeyOrUrl;
    return getPublicUrl(imageKeyOrUrl);
  }

  const category = categoryName?.toLowerCase() || "";

  const keywordMap: Record<string, string> = {
    sport: "fitness",
    voyage: "travel",
    "gastronomie & cuisine": "food",
    "culture & patrimoine": "culture",
  };

  const keyword = keywordMap[category] || "activity";

  // Fallback stable pour l'UI tant qu'aucune image n'est uploadée.
  const seed = activityId ? (parseInt(activityId.split("-")[0], 16) % 1000) : 1;

  return `https://loremflickr.com/800/600/${keyword}?lock=${seed}`;
}
