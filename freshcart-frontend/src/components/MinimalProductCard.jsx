import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

// --- UTILITY ---
const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
};

// --- COMPONENT ---
const MinimalProductCard = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(0); 

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 0) {
            setQuantity(newQuantity);
            if (newQuantity >= 0) {
                onAddToCart(product, newQuantity);
            }
        }
    };
    
    // Determine the price to show
    const displayPrice = product.DiscountedPrice || product.Price;
    const originalPrice = product.DiscountedPrice ? product.Price : null;

    return (
        <div className="flex items-center p-4 border-b border-gray-100 hover:bg-green-50 transition-colors">
            
            {/* Image */}
            <div className="flex-shrink-0 w-16 h-16 mr-4 rounded-lg overflow-hidden bg-gray-100">
                <img 
                    src={product.Image_URL || `https://placehold.co/80x80/cccccc/333333?text=${product.Brand}`} 
                    alt={product.ProductName} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/cccccc/333333?text=${product.Brand}`; }}
                />
            </div>

            {/* Product Details */}
            <div className="flex-grow min-w-0 pr-4">
                <p className="text-sm font-semibold text-gray-800 truncate">{product.ProductName}</p>
                <p className="text-xs text-gray-500">{product.Unit}</p>
            </div>

            {/* Price & Add Button/Controls */}
            <div className="flex flex-col items-end min-w-[100px] sm:min-w-[150px]">
                <div className="flex flex-col items-end">
                    <p className="text-md font-bold text-green-700 leading-tight">
                        {formatCurrency(displayPrice)}
                    </p>
                    {originalPrice && (
                        <p className="text-xs text-gray-400 line-through">
                            {formatCurrency(originalPrice)}
                        </p>
                    )}
                </div>

                <div className="mt-2">
                    {quantity === 0 ? (
                        <button
                            onClick={() => handleQuantityChange(1)}
                            className="flex items-center px-3 py-1 text-xs font-semibold bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-colors"
                        >
                            <Plus size={14} className="mr-1" /> ADD
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2 bg-green-500 text-white rounded-md p-1">
                            <button 
                                onClick={() => handleQuantityChange(-1)} 
                                className="p-1 rounded-full hover:bg-green-600 transition-colors"
                                aria-label="Decrease quantity"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="font-semibold text-sm w-4 text-center">{quantity}</span>
                            <button 
                                onClick={() => handleQuantityChange(1)} 
                                className="p-1 rounded-full hover:bg-green-600 transition-colors"
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

export default MinimalProductCard;