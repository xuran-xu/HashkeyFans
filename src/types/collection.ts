export interface CardResponse {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  collected: boolean;
  quantity: number;
  owner_address: string | null;
}

export interface StatsResponse {
  total_cards: number;
  collected_cards: number;
  total_quantity: number;
}

export interface CollectionResponse {
  cards: CardResponse[];
  stats: StatsResponse;
} 