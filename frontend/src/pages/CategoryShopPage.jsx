import React, { useState, useEffect, useMemo } from 'react';
import { axiosInstance } from '../utils/axios';
import ShopHeader from '../components/ShopHeader';
import CategorySidebar from '../components/CategorySidebar';
import ProductGrid from '../components/ProductGrid';

const CategoryShopPage = ({ categoryName, setView, onAddToCart, cartItems }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedCategory = categoryName || 'all';

  // Build category list dynamically
  const categories = useMemo(() => {
    const categoryMap = new Map();

    products.forEach(product => {
      if (product.category && typeof product.category === 'string') {
        categoryMap.set(
          product.category,
          (categoryMap.get(product.category) || 0) + 1
        );
      }
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/items/get-all-items');
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    let currentFiltered = products;

    if (selectedCategory !== 'all') {
      currentFiltered = currentFiltered.filter(product =>
        product.category === selectedCategory
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      currentFiltered = currentFiltered.filter(product =>
        product.productName?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      );
    }

    return currentFiltered;
  }, [selectedCategory, searchQuery, products]);

  const handleCategoryClick = (cat) => {
    if (cat === 'all') {
      setView({ name: 'shop', categoryName: 'all' });
    } else {
      setView({ name: 'shop', categoryName: cat });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="pt-24 flex items-center justify-center h-64">
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-24 flex items-center justify-center h-64">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-[calc(100vh-64px)]">

      {/* Shop Header (Search + Back Button) */}
      <ShopHeader
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onBack={() => setView({ name: 'home' })}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
            totalProducts={products.length}
          />

          {/* Products Grid */}
          <div className="flex-1">
            <ProductGrid
              products={filteredProducts}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onAddToCart={onAddToCart}
              cartItems={cartItems}
            />
          </div>

        </div>
      </div>

    </div>
  );
};

export default CategoryShopPage;
