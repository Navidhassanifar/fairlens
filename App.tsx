import React, { useState, useCallback, useMemo } from 'react';
import BuyerExperience from './components/BuyerExperience';
import SellerDashboard from './components/SellerDashboard';
import { products } from './data/products';
import { Product } from './types';

type View = 'buyer' | 'seller';

const App: React.FC = () => {
  const [view, setView] = useState<View>('buyer');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0].id);

  const selectedProduct = useMemo(() => 
    products.find(p => p.id === selectedProductId) || products[0],
    [selectedProductId]
  );

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const handleProductChange = useCallback((productId: string) => {
    setSelectedProductId(productId);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Header
        currentView={view}
        onSwitchView={handleViewChange}
        products={products}
        selectedProduct={selectedProduct}
        onProductChange={handleProductChange}
      />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {view === 'buyer' ? <BuyerExperience product={selectedProduct} /> : <SellerDashboard product={selectedProduct} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface HeaderProps {
  currentView: View;
  onSwitchView: (view: View) => void;
  products: Product[];
  selectedProduct: Product;
  onProductChange: (productId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onSwitchView, products, selectedProduct, onProductChange }) => {
  const buttonBaseClasses = "px-4 py-2 rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const activeClasses = "bg-[#D32F2F] text-white shadow-md";
  const inactiveClasses = "bg-white text-gray-600 hover:bg-gray-100";
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fa-IR').format(value) + " تومان";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
          <div className="flex items-center space-x-3">
            <svg className="h-8 w-8 text-[#D32F2F]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">FairLens</h1>
            <span className="text-xs font-medium text-white bg-[#D32F2F] px-2 py-0.5 rounded-full">PROTOTYPE</span>
          </div>
          <div className="w-full sm:w-auto">
            <label htmlFor="product-select" className="sr-only">Select Product</label>
            <select
              id="product-select"
              value={selectedProduct.id}
              onChange={(e) => onProductChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#D32F2F] focus:border-[#D32F2F] block w-full p-2 transition"
              aria-label="Select product to view"
            >
              {products.map(product => (
                <option 
                  key={product.id} 
                  value={product.id}
                  title={`Market Average: ${formatCurrency(product.marketAverage)} | Rating: ${product.rating} ⭐`}
                >
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg p-1 space-x-1">
          <button
            onClick={() => onSwitchView('buyer')}
            className={`${buttonBaseClasses} ${currentView === 'buyer' ? activeClasses : inactiveClasses}`}
          >
            Buyer View
          </button>
          <button
            onClick={() => onSwitchView('seller')}
            className={`${buttonBaseClasses} ${currentView === 'seller' ? activeClasses : inactiveClasses}`}
          >
            Seller View
          </button>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => (
    <footer className="text-center py-4 mt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">FairLens Prototype for Digikala &copy; 2024. All rights reserved.</p>
    </footer>
)

export default App;