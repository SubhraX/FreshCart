import React, { useState } from 'react';
import { formatCurrency } from '../utils/format';
import { Plus, Minus } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  // --- Logic copied from MinimalProductCard ---
  const [quantity, setQuantity] = useState(0); 
  const handleQuantityChange = (delta) => {
      const newQuantity = quantity + delta;
      if (newQuantity >= 0) {
          setQuantity(newQuantity);
          onAddToCart(product, newQuantity); // Pass full info up
      }
  };
  // --- End of copied logic ---

  const displayPrice = product.DiscountedPrice || product.Price;
  const originalPrice = product.DiscountedPrice ? product.Price : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <div className="h-40 w-full flex items-center justify-center p-4 bg-gray-50 rounded-t-lg overflow-hidden">
        <img
          src={product.Image_URL || `https://placehold.co/150x150/cccccc/333333?text=${product.Brand}`}
          alt={product.ProductName}
          className="h-full w-full object-contain"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x150/cccccc/333333?text=${product.Brand}`; }}
        />
      </div>

      {/* Info */}
      <div className="p-4 flex-grow flex flex-col">
        <p className="text-xs text-gray-500 uppercase">{product.Brand}</p>
        <h3 className="text-sm font-semibold text-gray-800 truncate h-10">
          {product.ProductName}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{product.Unit}</p>

        {/* Price */}
        <div className="flex-grow mt-4">
          <span className="text-base font-bold text-gray-900">{formatCurrency(displayPrice)}</span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through ml-2">{formatCurrency(originalPrice)}</span>
          )}
        </div>

        {/* Add Button / Stepper */}
        <div className="mt-4">
          {quantity === 0 ? (
              <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-full flex items-center justify-center px-3 py-2 text-sm font-semibold bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition-colors"
              >
                  <Plus size={16} className="mr-1" /> Add
              </button>
          ) : (
              <div className="flex items-center justify-between space-x-2 bg-green-600 text-white rounded-md p-1.5">
                  <button 
                      onClick={() => handleQuantityChange(-1)} 
                      className="p-1 rounded-full hover:bg-green-700 transition-colors"
                      aria-label="Decrease quantity"
                  >
                      <Minus size={16} />
                  </button>
                  <span className="font-semibold text-sm w-4 text-center">{quantity}</span>
                  <button 
                      onClick={() => handleQuantityChange(1)} 
                      className="p-1 rounded-full hover:bg-green-700 transition-colors"
                      aria-label="Increase quantity"
                  >
                      <Plus size={16} />
                  </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;