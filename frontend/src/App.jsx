// App.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import CategoryShopPage from './pages/CategoryShopPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';

// FIX: Moved outside the component so it's globally defined within this file
const slugToName = (slug) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function App() {
  const [view, setView] = useState({ name: 'home' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- PERSISTENT CART STATE ---
  // Initializes from localStorage if it exists
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('freshcart_items');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('freshcart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkAuthStatus();
    const path = window.location.pathname;
    
    if (path === '/login') {
      setView({ name: 'login' });
    } else if (path === '/cart') {
      setView({ name: 'cart' });
    } else if (path === '/shop') {
      setView({ name: 'shop', categoryName: 'all' });
    } else if (path.startsWith('/category/')) {
      const categorySlug = path.replace('/category/', '');
      const categoryName = slugToName(categorySlug); // Now correctly defined
      setView({ name: 'shop', categoryName: categoryName });
    } else {
      setView({ name: 'home' });
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      checkAuthStatus();
      const path = window.location.pathname;
      
      if (path === '/login') setView({ name: 'login' });
      else if (path === '/cart') setView({ name: 'cart' });
      else if (path === '/shop') setView({ name: 'shop', categoryName: 'all' });
      else if (path.startsWith('/category/')) {
        const categorySlug = path.replace('/category/', '');
        setView({ name: 'shop', categoryName: slugToName(categorySlug) });
      } else setView({ name: 'home' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (newView) => {
    setView(newView);
    checkAuthStatus();
    
    let path = '/';
    if (newView.name === 'login') path = '/login';
    else if (newView.name === 'cart') path = '/cart';
    else if (newView.name === 'shop') {
      if (newView.categoryName && newView.categoryName !== 'all') {
        const slug = newView.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        path = `/category/${slug}`;
      } else {
        path = '/shop';
      }
    }
    window.history.pushState({}, '', path);
  };

  // --- UPDATED ADD TO CART LOGIC ---
  const handleAddToCart = (product, newQuantity) => {
    if (!isLoggedIn) {
        alert("Please log in to add items to your cart.");
        navigate({ name: 'login' });
        return;
    }

    setCartItems(prevItems => {
      const productId = product._id || product.id;
      const existingItem = prevItems.find(item => (item._id || item.id) === productId);
      
      if (newQuantity <= 0) {
        return prevItems.filter(item => (item._id || item.id) !== productId);
      }

      if (existingItem) {
        return prevItems.map(item => 
          (item._id || item.id) === productId 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      }
      return [...prevItems, { ...product, quantity: newQuantity }];
    });
  };

  const renderView = () => {
    switch (view.name) {
      case 'shop':
        return <CategoryShopPage 
                  categoryName={view.categoryName} 
                  setView={navigate} 
                  onAddToCart={handleAddToCart}
                  cartItems={cartItems} 
                />;
      case 'login':
        return <LoginPage setView={navigate} />;
      case 'cart':
        return <CartPage 
                  cartItems={cartItems} 
                  onAddToCart={handleAddToCart} 
                  setView={navigate} 
                />;
      case 'home':
      default:
        return <HomePage setView={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header setView={navigate} isLoggedIn={isLoggedIn} cartCount={totalItemsCount} />
      <main className="min-h-[calc(100vh-64px)]">
        {renderView()}
      </main>
      <footer className="mt-12 pt-6 pb-6 border-t border-gray-200 text-center text-xs text-gray-400 max-w-6xl mx-auto px-4">
        <p>FreshCart Frontend: Refactored to component-based architecture.</p>
      </footer>
    </div>
  );
}