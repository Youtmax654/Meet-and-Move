export type TripStatus = "upcoming" | "past";

export type Trip = {
  id: string;
  coverImage: string;
  tag: string;
  dateRange: string;
  locationArea: string;
  locationCity: string;
  title: string;
  description: string;
  avatars: string[];
  extraAvatarsCount: string;
  status: TripStatus;
};

export type Memory = {
  id: string;
  dateBadge: string;
  title: string;
  subtitle: string;
  coverImage: string;
};
