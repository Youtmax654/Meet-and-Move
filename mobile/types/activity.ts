export interface Activity {
  id: string;
  title: string;
  description: string;
  price?: number;
  difficulty?: string;
  duration_hours?: number;
  latitude?: number;
  longitude?: number;
  max_participants?: number;
  enrolledCount?: number;
  host?: {
    id: string;
    username: string;
    bio?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  participants?: {
    id: string;
    username: string;
  }[];
}
