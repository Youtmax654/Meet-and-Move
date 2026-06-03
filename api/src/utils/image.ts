export function getAvatarUrl(id: string) {
  return `https://i.pravatar.cc/150?u=${id}`;
}

/**
 * This function is used to generate a mock image URL for an activity based on its category and ID.
 * It uses the LoremFlickr service to generate images related to the activity's category, and it ensures that the same activity ID will always yield the same image by using a lock parameter derived from the activity ID.
 *
 * @param categoryName
 * @param activityId
 * @returns
 */
export function getActivityImageUrl(
  categoryName?: string,
  activityId?: string,
) {
  const category = categoryName?.toLowerCase() ?? "";

  const keywordMap: Record<string, string> = {
    sport: "fitness",
    voyage: "travel",
    "gastronomie & cuisine": "food",
    "culture & patrimoine": "culture",
  };

  const keyword = keywordMap[category] || "activity";

  // Convert the beginning of the UUID to an integer for the lock
  const seed = activityId ? parseInt(activityId.split("-")[0], 16) % 1000 : 1;

  // Use loremflickr with a stable numeric seed for consistent image generation
  return `https://loremflickr.com/800/600/${keyword}?lock=${seed}`;
}
