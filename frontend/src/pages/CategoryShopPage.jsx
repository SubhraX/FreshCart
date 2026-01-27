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

  const categories = useMemo(() => {
    const categoryMap = new Map();
    products.forEach(product => {
      if (product.category && typeof product.category === 'string') {
        categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1);
      }
    });
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

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

  const filteredProducts = useMemo(() => {
    let currentFiltered = products;
    if (selectedCategory !== 'all') {
      currentFiltered = currentFiltered.filter(product =>
        product.category && product.category === selectedCategory
      );
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      currentFiltered = currentFiltered.filter(product =>
        (product.productName && product.productName.toLowerCase().includes(query)) ||
        (product.brand && product.brand.toLowerCase().includes(query))
      );
    }
    return currentFiltered;
  }, [selectedCategory, searchQuery, products]);

  const handleCategoryClick = (cat) => {
    cat === 'all' ? setView({ name: 'shop', categoryName: 'all' }) : setView({ name: 'shop', categoryName: cat });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopHeader searchQuery={searchQuery} onSearchChange={(e) => setSearchQuery(e.target.value)} onBack={() => setView({ name: 'home' })} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <CategorySidebar categories={categories} selectedCategory={selectedCategory} onCategoryClick={handleCategoryClick} totalProducts={products.length} />
          <div className="flex-1">
            <ProductGrid 
              products={filteredProducts} 
              selectedCategory={selectedCategory} 
              searchQuery={searchQuery} 
              onAddToCart={onAddToCart} 
              cartItems={cartItems} // Important for syncing
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryShopPage;