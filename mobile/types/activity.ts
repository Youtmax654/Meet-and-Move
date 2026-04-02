export interface PriceBreakdownItem {
  label: string;
  amount: number;
  color: string;
}

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
  participants?: Array<{
    id: string;
    username: string;
  }>;
  host?: {
    id: string;
    username: string;
    bio?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  price_breakdown?: PriceBreakdownItem[];
  eventDate?: string;
}
