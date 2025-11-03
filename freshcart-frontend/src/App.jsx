import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react'; // Keep for cart/login placeholders

// Import our new components and pages
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CategoryShopPage from './pages/CategoryShopPage';
import LoginPage from './pages/LoginPage';

// --- COMPONENT: App (The Main Router/State Manager) ---
export default function App() {
  // Simple client-side routing: { name: 'home' | 'shop' | 'login' | 'cart' | 'ai', categoryName?: string }
  const [view, setView] = useState({ name: 'home' });

  // Placeholder actions
  const handleAddToCart = (product, newQuantity) => {
    console.log(`Updated cart: ${product.ProductName}, Qty: ${newQuantity}`);
  };

  const renderView = () => {
    switch (view.name) {
      case 'shop':
        return <CategoryShopPage categoryName={view.categoryName} setView={setView} onAddToCart={handleAddToCart} />;
      case 'login':
        return <LoginPage setView={setView} />;
      case 'cart':
        return (
            <div className="pt-24 pb-12 max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-2xl mt-10 text-center">
                <h2 className="text-4xl font-extrabold text-green-700 mb-6">Shopping Cart & Payment (Next Step)</h2>
                <p className="text-gray-600 mb-8">This page will display cart items and payment options.</p>
                <button
                    onClick={() => setView({ name: 'home' })}
                    className="flex items-center mx-auto text-sm text-green-600 hover:text-green-700 transition-colors font-medium"
                >
                    <ChevronLeft size={16} className="mr-1" /> Back to Home
                </button>
            </div>
        );
      case 'home':
      default:
        return <HomePage setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      
      <Header setView={setView} />
      
      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-64px)]">
        {renderView()}
      </main>
      
      {/* Footer */}
      <footer className="mt-12 pt-6 pb-6 border-t border-gray-200 text-center text-xs text-gray-400 max-w-6xl mx-auto px-4">
        <p>FreshCart Frontend: Refactored to component-based architecture.</p>
      </footer>
    </div>
  );
}