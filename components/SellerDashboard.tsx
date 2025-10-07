
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, Funnel, FunnelChart, LabelList, Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Product } from '../types';
import { generateSellerPricingSuggestion, generateSellerInsightFeed } from '../services/geminiService';
import { generateCompetitorPrices, generateFunnelData, generateSearchTrend } from '../data/products';
import { ViewsIcon, ClicksIcon, ConversionIcon, RevenueIcon, TrendingUpIcon, BulbIcon } from './Icons';


const StatCard: React.FC<{ title: string; value: string; change: string; icon: React.ReactNode }> = ({ title, value, change, icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border flex items-start justify-between">
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-green-600 mt-1">{change}</p>
        </div>
        <div className="bg-red-100 text-[#D32F2F] p-2 rounded-full">
            {icon}
        </div>
    </div>
);

interface SellerDashboardProps {
    product: Product;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ product }) => {
    const sellerPrice = useMemo(() => Math.round(product.basePrice * 0.98 / 10000) * 10000, [product]);
    const competitorPricesData = useMemo(() => generateCompetitorPrices(product, sellerPrice), [product, sellerPrice]);
    const funnelData = useMemo(() => generateFunnelData(product), [product]);
    const searchTrend = useMemo(() => generateSearchTrend(product), [product]);
    
    const [pricingSuggestion, setPricingSuggestion] = useState<string>('');
    const [insights, setInsights] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchInsights = async () => {
            setIsLoading(true);
            const [suggestion, feed] = await Promise.all([
                generateSellerPricingSuggestion(sellerPrice, competitorPricesData, searchTrend, product.name),
                generateSellerInsightFeed(product.name)
            ]);
            setPricingSuggestion(suggestion);
            setInsights(feed);
            setIsLoading(false);
        };
        fetchInsights();
    }, [sellerPrice, competitorPricesData, searchTrend, product.name]);
    
    const getInsightIcon = (insight: string): React.ReactNode => {
        const lowercasedInsight = insight.toLowerCase();
        if (
            lowercasedInsight.includes('price') ||
            lowercasedInsight.includes('competitor') ||
            lowercasedInsight.includes('increase') ||
            lowercasedInsight.includes('decrease') ||
            lowercasedInsight.includes('demand') ||
            lowercasedInsight.includes('interest') ||
            lowercasedInsight.includes('trend')
        ) {
            return <TrendingUpIcon className="h-5 w-5 mt-0.5 text-[#D32F2F] flex-shrink-0" />;
        }
        return <BulbIcon className="h-5 w-5 mt-0.5 text-[#D32F2F] flex-shrink-0" />;
    };
    
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
            <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
                <p className="label font-semibold">{label}</p>
                <p className="intro text-[#D32F2F]">{`Searches: ${payload[0].value}`}</p>
            </div>
            );
        }
        return null;
    };
    
    const funnelMetrics = useMemo(() => ({
        views: funnelData[0].value,
        clicks: funnelData[1].value,
        conversions: funnelData[3].value,
        revenue: Math.round(funnelData[3].value * sellerPrice / 1000000)
    }), [funnelData, sellerPrice]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Views" value={funnelMetrics.views.toLocaleString()} change="+12.5% this week" icon={<ViewsIcon className="h-6 w-6"/>} />
                <StatCard title="Total Clicks" value={funnelMetrics.clicks.toLocaleString()} change="+8.2% this week" icon={<ClicksIcon className="h-6 w-6"/>} />
                <StatCard title="Conversions" value={funnelMetrics.conversions.toLocaleString()} change="+15.1% this week" icon={<ConversionIcon className="h-6 w-6"/>} />
                <StatCard title="Revenue" value={`${funnelMetrics.revenue}M T`} change="+22.4% this week" icon={<RevenueIcon className="h-6 w-6"/>} />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                     <h2 className="text-xl font-bold mb-4">Competitor Pricing Comparison</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={competitorPricesData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" domain={['dataMin - 500000', 'dataMax + 500000']} tickFormatter={(tick) => `${tick / 1000000}M`} tick={{ fontSize: 12 }} />
                            <YAxis type="category" dataKey="store" width={80} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value: number) => new Intl.NumberFormat('fa-IR').format(value) + " T"}/>
                            <Legend />
                            <Bar dataKey="price" name="Competitor Price" fill="#fb923c">
                                 <LabelList dataKey="price" position="right" formatter={(value: number) => new Intl.NumberFormat('fa-IR').format(value)} style={{ fill: '#374151', fontSize: '12px' }} />
                            </Bar>
                             <Bar dataKey="sellerPrice" name="Your Price" fill="#D32F2F" barSize={10}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-bold mb-4">Demand Funnel</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <FunnelChart>
                            <Tooltip />
                            <Funnel dataKey="value" data={funnelData} isAnimationActive>
                                <LabelList position="center" fill="#000" stroke="none" dataKey="name" style={{ fontSize: '12px' }}/>
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                </div>
            </div>

             <div className="grid lg:grid-cols-5 gap-8">
                 <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-bold mb-4">Search Trend (Last 30 Days)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={searchTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip/>}/>
                            <Legend />
                            <Line type="monotone" dataKey="searches" stroke="#D32F2F" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border h-full">
                        <h2 className="text-xl font-bold mb-4">AI-Powered Insights</h2>
                        <div className="space-y-4">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-start space-x-3 p-3">
                                        <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse flex-shrink-0"></div>
                                        <div className="flex-1 space-y-2 pt-1">
                                            <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                                            <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse"></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                [pricingSuggestion, ...insights.slice(0, 2)].map((insight, index) => (
                                    insight && <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                        {getInsightIcon(insight)}
                                        <p className="text-sm text-gray-800 font-medium">{insight}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default SellerDashboard;
