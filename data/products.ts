import { Product, PriceData, CompetitorPrice, TrendData, FunnelData } from '../types';

export const products: Product[] = [
    {
        id: "samsung_galaxy_a55_5g",
        name: "Samsung Galaxy A55 5G",
        image: "https://cdn.gsmarena.com/imgroot/news/24/03/samsung-galaxy-a55-a35-ofic/inline/-1200/gsmarena_001.jpg",
        rating: 4.6,
        reviews: 258,
        seller: "Digikala Official Store",
        basePrice: 21500000,
        marketAverage: 20500000,
    },
    {
        id: "apple_iphone_15_pro",
        name: "Apple iPhone 15 Pro",
        image: "https://cdn.gsmarena.com/imgroot/news/23/09/apple-iphone-15-pro-max-ofic/inline/-1200/gsmarena_001.jpg",
        rating: 4.8,
        reviews: 782,
        seller: "Apple Store IR",
        basePrice: 75000000,
        marketAverage: 73500000,
    },
    {
        id: "xiaomi_poco_x6_pro",
        name: "Xiaomi Poco X6 Pro",
        image: "https://cdn.gsmarena.com/imgroot/news/24/01/poco-x6-pro-and-m6-pro-4g-ofic/inline/-1200/gsmarena_001.jpg",
        rating: 4.5,
        reviews: 412,
        seller: "Xiaomi Iran",
        basePrice: 16800000,
        marketAverage: 16500000,
    },
    {
        id: "google_pixel_8_pro",
        name: "Google Pixel 8 Pro",
        image: "https://cdn.gsmarena.com/imgroot/news/23/09/google-pixel-8-pro-ofic/inline/-1200/gsmarena_001.jpg",
        rating: 4.7,
        reviews: 550,
        seller: "Google Store",
        basePrice: 68000000,
        marketAverage: 67000000,
    }
];

// Mock Data Generation Functions
export const generatePriceHistory = (product: Product): PriceData[] => {
    const data: PriceData[] = [];
    let price = product.basePrice;
    const today = new Date();
    for (let i = 90; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        price += Math.random() * (product.basePrice * 0.04) - (product.basePrice * 0.02);
        price = Math.max(product.basePrice * 0.9, price); // floor price
        data.push({
            date: date.toLocaleDateString('en-CA'),
            price: Math.round(price / 1000) * 1000,
        });
    }
    // Simulate a price drop for the demo on the first product
    if (product.id === "samsung_galaxy_a55_5g") {
        data[data.length - 1].price = 19500000;
    } else {
        data[data.length - 1].price = product.basePrice * 0.95;
    }
    return data;
};

export const generateCompetitorPrices = (product: Product, sellerPrice: number): CompetitorPrice[] => [
    { store: "You (Digikala)", price: sellerPrice, sellerPrice: sellerPrice },
    { store: "TechnoLife", price: product.marketAverage * 1.02, sellerPrice: sellerPrice },
    { store: "Basalam", price: product.marketAverage * 1.04, sellerPrice: sellerPrice },
    { store: "Other Sellers", price: product.marketAverage * 1.01, sellerPrice: sellerPrice },
].map(c => ({...c, price: Math.round(c.price/10000) * 10000}));


export const generateFunnelData = (product: Product): FunnelData[] => {
    const baseImpressions = product.basePrice > 50000000 ? 25000 : 15000;
    return [
        { value: baseImpressions, name: 'Impressions', fill: '#ef4444' },
        { value: Math.round(baseImpressions * 0.08), name: 'Clicks', fill: '#f87171' },
        { value: Math.round(baseImpressions * 0.03), name: 'Cart Adds', fill: '#fb923c' },
        { value: Math.round(baseImpressions * 0.012), name: 'Purchases', fill: '#facc15' },
    ];
};

export const generateSearchTrend = (product: Product): TrendData[] => {
    const data: TrendData[] = [];
    let searches = product.basePrice > 50000000 ? 2000 : 800;
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        searches += Math.random() * (searches * 0.1) - (searches * 0.05);
        searches = Math.max(searches * 0.8, searches);
        data.push({
            day: date.toLocaleDateString('en-CA', { day: '2-digit', month: 'short' }),
            searches: Math.round(searches),
        });
    }
    return data;
};