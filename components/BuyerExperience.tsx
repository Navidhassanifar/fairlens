
import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PriceData, CompetitorPrice, Product } from '../types';
import { generateBuyerInsight } from '../services/geminiService';
import { generatePriceHistory } from '../data/products';
import { CheckIcon, WarningIcon, BulbIcon } from './Icons';

interface BuyerExperienceProps {
  product: Product;
}

const BuyerExperience: React.FC<BuyerExperienceProps> = ({ product }) => {
    const priceHistory = useMemo(() => generatePriceHistory(product), [product]);
    const [insight, setInsight] = useState<string>('Generating smart insight...');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const [alertPrice, setAlertPrice] = useState<number | null>(null);
    const [alertPriceInput, setAlertPriceInput] = useState<string>('');
    const [showPriceDropAlert, setShowPriceDropAlert] = useState<boolean>(false);

    useEffect(() => {
        try {
            const storedAlertPrice = localStorage.getItem(product.id);
            if (storedAlertPrice) {
                setAlertPrice(JSON.parse(storedAlertPrice));
            } else {
                setAlertPrice(null);
            }
        } catch (error) {
            console.error("Failed to parse alert price from localStorage", error);
        }
        setShowPriceDropAlert(false); // Reset alert visibility on product change
    }, [product.id]);

    useEffect(() => {
        const fetchInsight = async () => {
            setIsLoading(true);
            const generatedInsight = await generateBuyerInsight(priceHistory, product.name);
            setInsight(generatedInsight);
            setIsLoading(false);
        };
        fetchInsight();
    }, [priceHistory, product.name]);

    const currentPrice = useMemo(() => priceHistory[priceHistory.length - 1]?.price || 0, [priceHistory]);
    const previousPrice = useMemo(() => priceHistory[priceHistory.length - 2]?.price || currentPrice, [priceHistory]);
    
    useEffect(() => {
        if (alertPrice && currentPrice <= alertPrice && currentPrice > 0) {
            setShowPriceDropAlert(true);
        }
    }, [currentPrice, alertPrice]);

    const isFairPrice = currentPrice <= product.marketAverage * 1.05;

    const competitors: CompetitorPrice[] = [
        { store: "Digikala", price: currentPrice },
        { store: "TechnoLife", price: product.marketAverage * 1.02 },
        { store: "Basalam", price: product.marketAverage * 1.04 },
        { store: "Mobile.ir", price: product.marketAverage * 1.01 },
    ].map(c => ({...c, price: Math.round(c.price / 1000) * 1000}));
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fa-IR').format(value) + " تومان";
    };

    const handleSetAlert = () => {
        const price = parseInt(alertPriceInput, 10);
        if (!isNaN(price) && price > 0) {
            localStorage.setItem(product.id, JSON.stringify(price));
            setAlertPrice(price);
            setAlertPriceInput('');
            if(currentPrice <= price) {
                setShowPriceDropAlert(true);
            }
        }
    };

    const handleRemoveAlert = () => {
        localStorage.removeItem(product.id);
        setAlertPrice(null);
        setShowPriceDropAlert(false);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
            <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
                <p className="label font-semibold">{`${new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}</p>
                <p className="intro text-[#D32F2F]">{`Price: ${formatCurrency(payload[0].value)}`}</p>
            </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {showPriceDropAlert && alertPrice && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg mb-4 flex justify-between items-center shadow-md animate-fade-in">
                    <div>
                        <p className="font-bold">Price Drop Alert!</p>
                        <p className="text-sm">The price for {product.name} has dropped to {formatCurrency(currentPrice)}, which is below your target of {formatCurrency(alertPrice)}.</p>
                    </div>
                    <button onClick={() => setShowPriceDropAlert(false)} className="text-xl font-bold text-green-800 hover:text-green-900">&times;</button>
                </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 flex justify-center items-center bg-white p-4 rounded-xl shadow-sm border">
                    <img src={product.image} alt={product.name} className="max-w-full h-auto object-contain rounded-lg" />
                </div>

                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border flex flex-col">
                    <div className="flex-grow">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
                        <div className="flex items-center space-x-4 text-sm my-4">
                            <div className="flex items-center space-x-1">
                                <span className="text-yellow-500">⭐</span>
                                <span className="font-semibold">{product.rating}</span>
                                <span className="text-gray-500">({product.reviews} reviews)</span>
                            </div>
                            <div className="text-gray-400">|</div>
                            <div className="text-gray-600">Seller: <span className="font-semibold text-[#D32F2F]">{product.seller}</span></div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                            <div className="flex items-baseline space-x-3">
                                <span className="text-3xl md:text-4xl font-extrabold text-[#D32F2F]">{formatCurrency(currentPrice)}</span>
                                <span className="text-lg text-gray-500 line-through">{formatCurrency(Math.round(previousPrice * 1.05 / 1000) * 1000)}</span>
                            </div>
                            <div className={`mt-2 flex items-center text-sm font-semibold ${isFairPrice ? 'text-green-600' : 'text-orange-600'}`}>
                                {isFairPrice ? <CheckIcon className="h-5 w-5 mr-1" /> : <WarningIcon className="h-5 w-5 mr-1" />}
                                {isFairPrice ? 'Fair Price' : 'Above Market Average'}
                            </div>
                        </div>
                    
                        <p className="text-gray-600 text-sm mt-4">Prices are updated daily. FairLens helps you track historical data to make an informed decision.</p>
                    </div>

                    <div className="pt-4 border-t mt-4">
                        <h3 className="font-semibold text-gray-700 mb-2">🔔 Set a Price Alert</h3>
                        {alertPrice ? (
                            <div className="bg-green-50 p-3 rounded-lg flex items-center justify-between">
                                <p className="text-sm text-green-800">
                                    Alert is active for prices below <span className="font-bold">{formatCurrency(alertPrice)}</span>.
                                </p>
                                <button onClick={handleRemoveAlert} className="text-sm font-semibold text-red-600 hover:text-red-800 transition">Remove</button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    value={alertPriceInput}
                                    onChange={(e) => setAlertPriceInput(e.target.value)}
                                    placeholder="Enter target price"
                                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition"
                                    aria-label="Target price for alert"
                                />
                                <button
                                    onClick={handleSetAlert}
                                    disabled={!alertPriceInput || parseInt(alertPriceInput, 10) <= 0}
                                    className="py-2 px-4 rounded-lg font-bold text-white bg-[#D32F2F] hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Set
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-bold mb-4">Price History (Last 90 Days)</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={priceHistory} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short' })} />
                                <YAxis tick={{ fontSize: 12 }} domain={['dataMin - 500000', 'dataMax + 500000']} tickFormatter={(tick) => `${Math.round(tick / 1000000)}M`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="price" name="Price (Toman)" stroke="#D32F2F" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                     <div className="mt-4 bg-gray-100 p-3 rounded-lg flex items-center space-x-3">
                        <BulbIcon className="h-6 w-6 text-[#D32F2F] flex-shrink-0" />
                        {isLoading ? (
                            <div className="h-4 bg-gray-300 rounded-full w-3/4 animate-pulse"></div>
                        ) : (
                             <p className="text-sm text-gray-700 font-medium">{insight}</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-bold mb-4">Market Comparison</h2>
                    <div className="space-y-3">
                        {competitors.map((comp, index) => (
                            <div key={index} className={`p-3 rounded-lg flex justify-between items-center ${comp.store === 'Digikala' ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                                <div>
                                    <p className="font-semibold">{comp.store}</p>
                                    {comp.store === 'Digikala' && <p className="text-xs text-red-600">Your Seller</p>}
                                </div>
                                <p className="font-bold text-gray-800">{formatCurrency(comp.price)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerExperience;
