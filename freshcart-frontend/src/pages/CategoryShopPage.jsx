import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockData';
import MinimalProductCard from '../components/MinimalProductCard';

const CategoryShopPage = ({ categoryName, setView, onAddToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setLoading(true);
        
        // --- API SIMULATION START ---
        const filteredProducts = MOCK_PRODUCTS.filter(p => 
            p.Category === categoryName && 
            (p.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) || 
             p.Brand.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        const timer = setTimeout(() => {
            setProducts(filteredProducts);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer); // Cleanup
        // --- API SIMULATION END ---

    }, [categoryName, searchTerm]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-green-500 border-gray-200 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading {categoryName} products...</p>
                </div>
            );
        }

        if (products.length === 0) {
            return (
                <div className="text-center py-10">
                    <p className="text-gray-600 text-lg">No products found in "{categoryName}" matching "{searchTerm}".</p>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-xl shadow-xl divide-y divide-gray-100">
                {products.map(product => (
                    <MinimalProductCard 
                        key={product.ProductID} 
                        product={product} 
                        onAddToCart={onAddToCart} 
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
            {/* Header and Search */}
            <div className="mb-8">
                <button
                    onClick={() => setView({ name: 'home' })}
                    className="flex items-center text-sm text-green-600 hover:text-green-700 transition-colors font-medium mb-4"
                >
                    <ChevronLeft size={16} className="mr-1" /> Back to Categories
                </button>
                <h1 className="text-3xl font-extrabold text-gray-800 border-b pb-2 mb-4">{categoryName}</h1>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder={`Search products in ${categoryName}...`}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Product List */}
            {renderContent()}

            <p className="text-center text-sm text-gray-500 mt-6">
                Displaying {products.length} products. (Simulated pagination/fetching for 6000+ items would go here.)
            </p>
        </div>
    );
};

export default CategoryShopPage;