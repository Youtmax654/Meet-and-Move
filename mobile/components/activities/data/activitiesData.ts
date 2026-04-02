import { Memory, Trip } from "@/components/activities/types";

export const activitiesTrips: Trip[] = [
  {
    id: "1",
    status: "upcoming",
    coverImage:
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80",
    tag: "SQUAD CONFIRMÉ",
    dateRange: "12 — 15 JUILLET",
    locationArea: "LOCALITÉ",
    locationCity: "Annecy, FR",
    title: "Sommet des activités de plein air d'Annecy",
    description:
      "Randonnée, paddle et yoga au bord du lac avec la vue sur les sommets. Un séjour...",
    avatars: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=100&q=80",
    ],
    extraAvatarsCount: "+5",
  },
  {
    id: "2",
    status: "upcoming",
    coverImage:
      "https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?auto=format&fit=crop&w=1200&q=80",
    tag: "SQUAD CONFIRMÉ",
    dateRange: "12 — 15 JUILLET",
    locationArea: "LOCALITÉ",
    locationCity: "Bordeaux, FR",
    title: "Vignobles de Bordeaux",
    description:
      "Dégustez au cœur des prestigieux vignobles de Saint-Émilion...",
    avatars: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=100&q=80",
    ],
    extraAvatarsCount: "+5",
  },
];

export const activitiesMemories: Memory[] = [
  {
    id: "1",
    title: "Chamonix Base Camp",
    subtitle: "Avec le Squad Aventure",
    dateBadge: "Mai 2024",
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    title: "Calanques Marseille",
    subtitle: "Avec le Squad Sud",
    dateBadge: "Avril 2024",
    coverImage:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80",
  },
];
