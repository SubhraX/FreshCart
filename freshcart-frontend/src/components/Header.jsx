import React from 'react';
import { ShoppingCart, User, Cpu } from 'lucide-react';

const Header = ({ setView }) => (
  <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-lg">
    <div className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
      {/* Logo/Brand */}
      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 cursor-pointer" onClick={() => setView({ name: 'home' })}>
        FreshCart
      </div>

      {/* Navigation/Actions */}
      <div className="flex items-center space-x-4">
        {/* AI Recipe Maker Button */}
        <button
          className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          onClick={() => console.log('AI Recipe Maker Tapped')}
        >
          <Cpu size={18} />
          <span>AI Recipe Maker</span>
        </button>

        {/* Login Placeholder */}
        <button
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setView({ name: 'login' })}
          aria-label="Login"
        >
          <User size={24} />
        </button>

        {/* Cart Placeholder */}
        <button
          className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setView({ name: 'cart' })}
          aria-label="Shopping Cart"
        >
          <ShoppingCart size={24} />
          {/* Mock Cart Item Count */}
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
        </button>
      </div>
    </div>
  </header>
);

export default Header;