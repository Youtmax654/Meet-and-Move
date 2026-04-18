export function formatShortFrenchDate(value: Date | null): string {
  if (!value) return "";

  return value.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}
