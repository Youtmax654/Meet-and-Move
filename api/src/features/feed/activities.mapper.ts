export function mapActivityToCard(activity: any) {
  return {
    image: getImage(activity.category?.id),

    date: formatDate(activity.event_date),

    title: activity.title,

    location: formatLocation(activity.latitude, activity.longitude),

    isHostVerified: activity.isHostVerified,

    avatars: activity.participants
      ?.slice(0, 4)
      .map((p: any) => getAvatar(p.username)),

    extra: Math.max(0, (activity.participants?.length || 0) - 4),

    price: `${activity.price ?? 0}€`,
  };
}

// ---------------- HELPERS ----------------

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

function formatLocation(lat: number | string, lng: number | string) {
  return `📍 ${Number(lat).toFixed(2)}, ${Number(lng).toFixed(2)}`;
}

function getAvatar(username: string) {
  return `https://api.dicebear.com/7.x/initials/png?seed=${username}`;
}

function getImage(categoryId?: string) {
  switch (categoryId) {
    case '11111111-1111-1111-1111-111111111111':
      return 'https://images.unsplash.com/photo-1501785888041-af3ef285b470';
    case '22222222-2222-2222-2222-222222222222':
      return 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b';
    case '33333333-3333-3333-3333-333333333333':
      return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836';
    default:
      return 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee';
  }
}