import type {
  Guide,
  TopRatedActivity,
  UpcomingActivity,
} from "@/features/home/schemas/feed.schema";

export const upcomingActivities: UpcomingActivity[] = [
  {
    id: "1",
    date: "12 Oct",
    title: "Randonnée sur la Crête du Mont-Blanc",
    location: "Hôte : Elena K.",
    isHostVerified: true,
    avatars: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    ],
    extra: "+6",
    price: "55€",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    date: "14 Oct",
    title: "Atelier peinture en plein air",
    location: "Hôte : Sarah M.",
    avatars: [
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1542204625-de293a06df32?auto=format&fit=crop&w=100&q=80",
    ],
    extra: "+3",
    price: "38€",
    image:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80",
  },
];

export const weeklyTopRated: TopRatedActivity[] = [
  {
    id: "1",
    title: "Dîner secret à Saint-Germain",
    image:
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
  },
  {
    id: "2",
    title: "Balade photo nocturne",
    image:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=1200&q=80",
    isFeatured: false,
  },
  {
    id: "3",
    title: "Atelier Céramique",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80",
    isFeatured: false,
  },
];

export const nearbyGuides: Guide[] = [
  {
    id: "1",
    name: "Sarah Thompson",
    details: "Expert en : Gastronomie, Histoire",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    isVerified: true,
  },
  {
    id: "2",
    name: "James Miller",
    details: "Expert en : Vie nocturne, Musique",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    isVerified: true,
  },
];
