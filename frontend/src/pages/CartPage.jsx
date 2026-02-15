import React, { useState } from 'react';
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag, CreditCard, MapPin } from 'lucide-react';
import { toast } from "react-toastify";

const CartPage = ({ cartItems, onAddToCart, setView }) => {

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    pincode: '',
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.discountedPrice * item.quantity,
    0
  );

  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!address.fullName || !address.phone || !address.street || !address.pincode) {
      toast.error("Please fill in all delivery address details.", {
        toastId: "address-error"
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          deliveryFee: deliveryFee
        }),
      });

      const data = await response.json();

      if (!data.url) {
        toast.error("Failed to create checkout session.", {
          toastId: "checkout-error"
        });
        return;
      }

      toast.success("Redirecting to secure payment...", {
        toastId: "redirecting"
      });

      setTimeout(() => {
        window.location.href = data.url;
      }, 1200);

    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.", {
        toastId: "payment-error"
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-12 max-w-lg mx-auto px-4 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
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
          className="mr-4 p-2 hover:bg-white rounded-full shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-black text-gray-800">Shopping Cart</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* LEFT COLUMN */}
        <div className="flex-1 space-y-8">

          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item._id || item.id}
                className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4">

                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-24 h-24 object-contain rounded-lg bg-gray-50"
                />

                <div className="flex-grow">
                  <h3 className="font-bold text-gray-800">
                    {item.productName}
                  </h3>
                  <p className="text-green-700 font-semibold">
                    ₹{item.discountedPrice.toFixed(2)}
                  </p>

                  <div className="flex items-center mt-3 bg-gray-50 rounded-lg border w-fit">
                    <button
                      onClick={() => onAddToCart(item, item.quantity - 1)}
                      className="p-2"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="px-4 font-bold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => onAddToCart(item, item.quantity + 1)}
                      className="p-2"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">
                    ₹{(item.discountedPrice * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => onAddToCart(item, 0)}
                    className="text-red-500 mt-3"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DELIVERY ADDRESS SECTION */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <MapPin className="text-green-600" />
              <h2 className="text-xl font-bold">Delivery Address</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="text"
                name="fullName"
                value={address.fullName}
                onChange={handleAddressChange}
                placeholder="Full Name"
                className="border p-3 rounded-xl"
              />

              <input
                type="tel"
                name="phone"
                value={address.phone}
                onChange={handleAddressChange}
                placeholder="Phone Number"
                className="border p-3 rounded-xl"
              />

              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleAddressChange}
                placeholder="Pincode"
                className="border p-3 rounded-xl"
              />

              <textarea
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                placeholder="Street Address"
                rows="2"
                className="border p-3 rounded-xl md:col-span-2"
              />

              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                placeholder="City & State"
                className="border p-3 rounded-xl md:col-span-2"
              />

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:w-96">
          <div className="bg-white p-6 rounded-3xl shadow-xl sticky top-24">

            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
            </div>

            <div className="flex justify-between text-2xl font-black mb-6">
              <span>Total</span>
              <span className="text-green-700">
                ₹{total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-all"
            >
              <CreditCard size={18} className="inline mr-2" />
              Proceed to Payment
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
