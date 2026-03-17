import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from '../utils/axios.js';

const AIRecipePage = ({ setView, onAddToCart }) => {

  const [dish, setDish] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!dish.trim()) {
      toast.error("Please enter a dish name");
      return;
    }

    try {
      setLoading(true);

      // Switched from fetch to axiosInstance
      const response = await axiosInstance.post("/api/ai/recipe", { dish });

      const data = response.data;

      // ✅ SAFETY CHECK
      if (!data.ingredients || !Array.isArray(data.ingredients)) {
        toast.error("AI failed to fetch ingredients properly");
        setIngredients([]);
        return;
      }

      setIngredients(data.ingredients);
      setCurrentIndex(0);

    } catch (error) {
      // Axios error handling
      const errorMsg = error.response?.data?.message || "AI fetch failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (product) => {
    onAddToCart(product, 1);
    toast.success(`${product.productName} added to cart`);
  };

  const handleNext = () => {
    if (!ingredients || ingredients.length === 0) return;

    if (currentIndex < ingredients.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.success("All ingredients processed!");
      setView({ name: "cart" });
    }
  };

  // ===================== SEARCH VIEW =====================
  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="pt-32 max-w-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-black mb-6 text-gray-800">
          What do you want to cook?
        </h2>

        <input
          type="text"
          value={dish}
          onChange={(e) => setDish(e.target.value)}
          placeholder="e.g. Paneer Butter Masala"
          className="w-full border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
        />

        <button
          onClick={handleSearch}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition"
        >
          {loading ? "Loading..." : "Find Ingredients"}
        </button>
      </div>
    );
  }

  // ✅ SAFE ACCESS
  const currentIngredient = ingredients[currentIndex] || {
    name: "",
    matchedProducts: []
  };

  // ===================== INGREDIENT VIEW =====================
  return (
    <div className="pt-24 max-w-5xl mx-auto px-4">

      <h2 className="text-xl font-bold mb-6 text-gray-700">
        Ingredient {currentIndex + 1} of {ingredients.length}
      </h2>

      <div className="bg-white p-8 rounded-3xl shadow-xl">

        <h3 className="text-3xl font-black text-green-700 mb-8 capitalize">
          {currentIngredient.name}
        </h3>

        {(currentIngredient.matchedProducts || []).length === 0 && (
          <p className="text-gray-500 mb-6">
            No matching grocery products found.
          </p>
        )}

        <div className="space-y-5">

          {(currentIngredient.matchedProducts || []).map(product => (
            <div
              key={product._id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:shadow-md transition"
            >

              {/* LEFT SIDE */}
              <div className="flex items-center gap-5">

                <img
                  src={product.imageUrl || product.absoluteUrl}
                  alt={product.productName}
                  className="w-20 h-20 object-contain bg-white rounded-xl border"
                />

                <div>
                  <h4 className="font-bold text-gray-800 text-lg">
                    {product.productName}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {product.brand}
                  </p>

                  <p className="text-green-700 font-bold mt-1 text-lg">
                    ₹{product.discountedPrice?.toFixed(2)}
                  </p>
                </div>

              </div>

              <button
                onClick={() => handleAdd(product)}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold transition"
              >
                Add
              </button>

            </div>
          ))}

        </div>

        <div className="flex justify-between mt-10">

          <button
            onClick={handleNext}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-2xl font-semibold transition"
          >
            Skip
          </button>

          <button
            onClick={handleNext}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold transition"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};

export default AIRecipePage;