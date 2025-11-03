import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import CategoryCard from '../components/CategoryCard';

const HomePage = ({ setView }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectCategory = (categoryName) => {
    setView({ name: 'shop', categoryName });
  };

  const filteredCategories = CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 pb-12">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight text-center">
        Shop By Category
      </h2>
      <p className="text-xl text-gray-500 mb-8 text-center max-w-2xl mx-auto">
        Find fresh ingredients fast. Select a category below to browse our expertly curated selection.
      </p>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto px-4 mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for a category (e.g., Bakery, Fruits...)"
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Categories */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {filteredCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onSelectCategory={handleSelectCategory}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg py-10">
          <p>No categories found matching "{searchTerm}".</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;