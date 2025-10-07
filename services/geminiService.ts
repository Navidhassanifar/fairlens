
import { GoogleGenAI, Type } from '@google/genai';
import { PriceData, CompetitorPrice, TrendData } from '../types';

// WARNING: It is not recommended to hardcode your API key.
// Please replace "YOUR_API_KEY_HERE" with your actual Gemini API key.
const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY_HERE" as string });

export const generateBuyerInsight = async (priceHistory: PriceData[]): Promise<string> => {
  try {
    const prompt = `Analyze this price history for a 'Samsung Galaxy A55'. The data is for the last 90 days. Provide a short, smart insight for a potential buyer in a single sentence, highlighting if it's a good deal. Example: "This product’s price dropped 12% over the past month. You’re getting a great deal today." The data is: ${JSON.stringify(priceHistory.slice(-30))}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating buyer insight:", error);
    return "Insight: The price has been stable recently. Check market comparisons for the best deal.";
  }
};

export const generateSellerPricingSuggestion = async (
  sellerPrice: number,
  competitorPrices: CompetitorPrice[],
  searchTrend: TrendData[]
): Promise<string> => {
  try {
    const prompt = `You are an e-commerce pricing expert for the Iranian market. A seller's current price for a 'Samsung Galaxy A55' is ${sellerPrice} Toman. Competitor prices are ${JSON.stringify(competitorPrices)}. Recent search trends are ${JSON.stringify(searchTrend.slice(-7))}. Provide a concise, actionable pricing recommendation in a single sentence. Example: "Based on current demand and competitor analysis, we recommend lowering your price by 3.8% to potentially increase conversion rate by up to 9%."`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating seller pricing suggestion:", error);
    return "We recommend aligning your price with the market average to stay competitive.";
  }
};


export const generateSellerInsightFeed = async (): Promise<string[]> => {
    try {
        const prompt = "Generate exactly 3 short, distinct, actionable insights for an e-commerce seller of a 'Samsung Galaxy A55' in the Iranian market. Examples: 'Your product was the most clicked in its category yesterday.', 'Competitor TechnoLife raised their price by 4% today.', 'Search interest for this product is up 15% this week.'";

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        insights: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        }
                    }
                },
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.insights || ["Check your inventory levels due to recent sales activity."];

    } catch (error) {
        console.error("Error generating seller insight feed:", error);
        return [
            "Your product was viewed 20% more than the category average yesterday.",
            "A competitor recently lowered their price. Consider a promotional offer.",
            "Weekend sales show a strong upward trend for this item."
        ];
    }
};