import React, { useState } from 'react';
import { Activity, ArrowLeft, BarChart3, RotateCcw, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AIScore = ({ cartItems, setView }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ensure this endpoint matches your Node.js backend route
      const { data } = await axios.post('/api/aiscore/analyze', { cartItems });
      setResult(data);
    } catch (err) {
      console.error("Analysis Error:", err);
      setError(err.response?.data?.message || "Failed to analyze cart. Ensure AI servers are online.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine score color
  const getScoreColor = (score) => {
    if (score >= 7) return 'text-green-600 border-green-100 bg-green-50';
    if (score >= 4) return 'text-yellow-600 border-yellow-100 bg-yellow-50';
    return 'text-red-600 border-red-100 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <button 
          onClick={() => setView({ name: 'cart' })}
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-all font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Cart
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-10 text-white text-center">
            <Activity className="mx-auto mb-4 opacity-90 animate-pulse" size={48} />
            <h1 className="text-4xl font-black tracking-tight mb-2">FreshKart Health AI</h1>
            <p className="text-indigo-100 font-medium">Nutritional Insight Engine</p>
          </div>

          <div className="p-10">
            {!result ? (
              <div className="text-center py-6">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready for a Cart Scan?</h2>
                  <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Our AI estimates macro-nutrients and runs them through a trained Machine Learning model to rate your cart.
                  </p>
                </div>
                
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all duration-300 transform active:scale-95 ${
                    loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="tracking-wide">AI Handshake in Progress...</span>
                    </div>
                  ) : "Rate My Cart"}
                </button>
                
                {error && (
                  <div className="mt-6 flex items-center justify-center text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
                    <AlertCircle size={18} className="mr-2" />
                    <span className="text-sm font-bold">{error}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                
                {/* Score Visualization */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full border-8 mb-6 ${getScoreColor(result.healthScore)}`}>
                    <div className="flex flex-col">
                      <span className="text-6xl font-black leading-none">{result.healthScore}</span>
                      <span className="text-sm font-bold opacity-40 uppercase tracking-tighter">Score</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-gray-800">Analysis Complete</h2>
                  <p className="text-gray-500 mt-2 font-medium italic">
                    {result.healthScore >= 7 ? "Excellent balance of nutrients!" : 
                     result.healthScore >= 4 ? "A decent mix, but could be cleaner." : 
                     "Warning: Significant processed contents detected."}
                  </p>
                </div>

                <hr className="border-gray-100" />

                {/* Macros Grid */}
                <div>
                  <h3 className="flex items-center font-black text-gray-800 mb-6 text-lg tracking-tight">
                    <BarChart3 size={22} className="mr-2 text-indigo-600" />
                    Estimated Macro Totals
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
                  className="w-full py-4 flex items-center justify-center text-gray-400 font-bold hover:text-indigo-600 bg-gray-50 rounded-2xl transition-all hover:bg-white border border-transparent hover:border-gray-200"
                >
                  <RotateCcw size={18} className="mr-2" /> New Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable card component for nutrition stats
const NutritionCard = ({ label, value, unit }) => (
  <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-black text-gray-800">
      {value || 0}
      <span className="text-xs ml-1 font-bold text-gray-300 lowercase">{unit}</span>
    </p>
  </div>
);

export default AIScore;