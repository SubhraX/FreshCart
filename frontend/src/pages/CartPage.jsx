// pages/CartPage.jsx
import React from 'react';
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';

const CartPage = ({ cartItems, onAddToCart, setView }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + (item.discountedPrice * item.quantity), 0);
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-12 max-w-lg mx-auto px-4 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl">8
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some fresh items to your basket to get started!</p>
          <button
            onClick={() => setView({ name: 'home' })}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 max-w-6xl mx-auto px-4">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => setView({ name: 'home' })} 
          className="mr-4 p-2 hover:bg-white rounded-full transition-colors shadow-sm"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-3xl font-black text-gray-800">Shopping Cart</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Item List */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id || item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <img 
                src={item.imageUrl} 
                alt={item.productName} 
                className="w-24 h-24 object-contain rounded-lg bg-gray-50" 
              />
              <div className="flex-grow">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{item.brand}</span>
                <h3 className="font-bold text-gray-800 line-clamp-1">{item.productName}</h3>
                <p className="text-green-700 font-semibold mt-1">₹{item.discountedPrice}</p>
                
                <div className="flex items-center mt-3">
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                    <button 
                      onClick={() => onAddToCart(item, item.quantity - 1)}
                      className="p-1.5 hover:text-green-600 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-bold text-sm text-gray-700">{item.quantity}</span>
                    <button 
                      onClick={() => onAddToCart(item, item.quantity + 1)}
                      className="p-1.5 hover:text-green-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900">₹{item.discountedPrice * item.quantity}</p>
                <button 
                  onClick={() => onAddToCart(item, 0)}
                  className="text-gray-400 hover:text-red-500 mt-4 transition-colors p-1"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Summary */}
        <div className="lg:w-96">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-green-50 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Order Details</h2>
            <div className="space-y-4 pb-6 border-b border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Basket Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
            </div>
            
            <div className="flex justify-between py-6 text-2xl font-black">
              <span className="text-gray-800">Total</span>
              <span className="text-green-700">₹{total}</span>
            </div>

            <button
              onClick={() => alert("Backend integration needed for Checkout!")}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              Proceed to Payment
            </button>
            
            {deliveryFee > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
                <p className="text-xs text-center text-green-800">
                  Add <strong>₹{500 - subtotal}</strong> more for <strong>FREE delivery</strong>!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;