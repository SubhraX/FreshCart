import React from 'react';
import { ShoppingCart, User, Cpu, LogOut, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const Header = ({ setView, isLoggedIn, cartCount, user }) => {

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  // Updated logic to handle RateCart click with Toastify
  const handleRateCartClick = () => {
    if (cartCount === 0) {
      toast.error("Your cart is empty! Add some items to analyze your cart score.");
    } else {
      setView({ name: "aiscore" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <div
          className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 cursor-pointer"
          onClick={() => setView({ name: 'home' })}
        >
          FreshCart
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center space-x-4">

          {/* RATE CART BUTTON */}
          <button
            onClick={handleRateCartClick}
            className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Sparkles size={18} />
            <span>RateCart</span>
          </button>

          <button
            onClick={() => setView({ name: "ai" })}
            className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Cpu size={18} />
            <span>ChefGen</span>
          </button>

          {/* LOGIN / USER SECTION */}
          {!isLoggedIn ? (
            <button
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setView({ name: 'login' })}
            >
              <User size={24} />
            </button>
          ) : (
            <div className="flex items-center space-x-3">

              {/* Username */}
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <span className="text-sm font-semibold text-gray-700">
                  Hi, {user?.name}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}

          {/* CART BUTTON */}
          <button
            className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setView({ name: 'cart' })}
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;