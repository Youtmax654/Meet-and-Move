export type UpcomingActivity = {
  id: string;
  date: string;
  title: string;
  location: string;
  avatars: string[];
  extra: string;
  price: string;
  image: string;
};

export type TopRatedActivity = {
  id: string;
  title: string;
  image: string;
  isFeatured: boolean;
};

export type Guide = {
  id: string;
  name: string;
  details: string;
  image: string;
};
