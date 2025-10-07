
export interface PriceData {
  date: string;
  price: number;
}

export interface CompetitorPrice {
  store: string;
  price: number;
  sellerPrice?: number;
}

export interface FunnelData {
  name: string;
  value: number;
  fill: string;
}

export interface TrendData {
    day: string;
    searches: number;
}
