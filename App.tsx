
import React, { useState, useCallback } from 'react';
import BuyerExperience from './components/BuyerExperience';
import SellerDashboard from './components/SellerDashboard';

type View = 'buyer' | 'seller';

const App: React.FC = () => {
  const [view, setView] = useState<View>('buyer');

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Header currentView={view} onSwitchView={handleViewChange} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {view === 'buyer' ? <BuyerExperience /> : <SellerDashboard />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface HeaderProps {
  currentView: View;
  onSwitchView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onSwitchView }) => {
  const buttonBaseClasses = "px-4 py-2 rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const activeClasses = "bg-[#D32F2F] text-white shadow-md";
  const inactiveClasses = "bg-white text-gray-600 hover:bg-gray-100";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg className="h-8 w-8 text-[#D32F2F]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">FairLens</h1>
          <span className="text-xs font-medium text-white bg-[#D32F2F] px-2 py-0.5 rounded-full">PROTOTYPE</span>
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
