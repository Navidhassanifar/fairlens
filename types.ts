
export interface Product {
    id: string;
    name: string;
    image: string;
    rating: number;
    reviews: number;
    seller: string;
    basePrice: number;
    marketAverage: number;
}

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
