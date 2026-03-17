import React, { useState } from 'react';
import { Activity, ShieldCheck, Zap, ArrowLeft, BarChart3 } from 'lucide-react';
import axios from 'axios';

const AIScore = ({ cartItems, setView }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      // API call to your backend
      const { data } = await axios.post('/api/aiscore/analyze', { cartItems });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Logic */}
        <button 
          onClick={() => setView({ name: 'cart' })}
          className="flex items-center text-gray-600 hover:text-green-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Cart
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 text-white text-center">
            <Activity className="mx-auto mb-4" size={48} />
            <h1 className="text-3xl font-black mb-2">FreshKart Health AI</h1>
            
          </div>

          <div className="p-8">
            {!result ? (
              <div className="text-center py-10">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Ready for a Cart Scan?</h2>
                <p className="text-gray-500 mb-8">We will analyze nutrition facts for your food items to generate a cart score.</p>
                
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 ${
                    loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 hover:scale-[1.02]'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing nutrition data...</span>
                    </div>
                  ) : "Rate My Cart"}
                </button>
                {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Score Section */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-green-100 bg-green-50 mb-4">
                    <span className="text-5xl font-black text-green-600">{result.healthScore}</span>
                    <span className="text-xl font-bold text-green-300">/10</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Your Cart Score</h2>
                  <p className="text-gray-500">Based on processed item content and nutrient balance.</p>
                </div>

                <hr className="border-gray-100" />

                {/* Nutrition Summary */}
                <div>
                  <h3 className="flex items-center font-bold text-gray-800 mb-4">
                    <BarChart3 size={20} className="mr-2 text-indigo-600" />
                    Estimated Nutrition Summary
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <NutritionCard label="Calories" value={result.cartSummary.calories} unit="kcal" />
                    <NutritionCard label="Protein" value={result.cartSummary.protein} unit="g" />
                    <NutritionCard label="Carbs" value={result.cartSummary.carbs} unit="g" />
                    <NutritionCard label="Fats" value={result.cartSummary.fat} unit="g" />
                    <NutritionCard label="Sugar" value={result.cartSummary.sugar} unit="g" />
                    <NutritionCard label="Fiber" value={result.cartSummary.fiber} unit="g" />
                  </div>
                </div>

                <button 
                  onClick={() => setResult(null)}
                  className="w-full py-3 text-gray-400 font-medium hover:text-gray-600 transition-colors"
                >
                  Clear Results
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple reusable card component for stats
const NutritionCard = ({ label, value, unit }) => (
  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
    <p className="text-xl font-black text-gray-700">{value}<span className="text-sm ml-1 font-normal opacity-60">{unit}</span></p>
  </div>
);

export default AIScore;