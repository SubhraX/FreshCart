// components/Header.jsx
import React from 'react';
import { ShoppingCart, User, Cpu } from 'lucide-react';

const Header = ({ setView, isLoggedIn, cartCount }) => (
  <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-lg">
    <div className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
      <div
        className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 cursor-pointer"
        onClick={() => setView({ name: 'home' })}
      >
        FreshCart
      </div>

      <div className="flex items-center space-x-4">
        <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all">
          <Cpu size={18} />
          <span>AI Recipe</span>
        </button>

        <button
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setView({ name: 'login' })}
        >
          <User size={24} />
        </button>

        {/* CART BUTTON WITH BADGE */}
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

export default Header;