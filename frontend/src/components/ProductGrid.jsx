import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, selectedCategory, searchQuery, onAddToCart, cartItems }) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500 text-lg">
          {searchQuery ? 'No products found matching your search.' : 'No products found in this category.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 text-gray-600">
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
        {selectedCategory !== 'all' && <span className="ml-2 text-green-600 font-medium">in {selectedCategory}</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            onAddToCart={onAddToCart}
            cartItems={cartItems} // Passing sync state
          />
        ))}
      </div>
    </>
  );
};

export default ProductGrid;