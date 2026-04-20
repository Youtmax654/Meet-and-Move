export function getAvatarUrl(id: string) {
  return `https://i.pravatar.cc/150?u=${id}`;
}

export function getActivityImageUrl(categoryName?: string, activityId?: string) {
  const category = categoryName?.toLowerCase() || '';
  
  const keywordMap: Record<string, string> = {
    'sport': 'fitness',
    'voyage': 'travel',
    'gastronomie & cuisine': 'food',
    'culture & patrimoine': 'culture',
  };

  const keyword = keywordMap[category] || 'activity';
  
  // On transforme le début de l'UUID en nombre entier pour le lock
  const seed = activityId ? parseInt(activityId.split('-')[0], 16) % 1000 : 1;
  
  // Utilisation de loremflickr avec un seed (lock) numérique stable
  return `https://loremflickr.com/800/600/${keyword}?lock=${seed}`;
}
