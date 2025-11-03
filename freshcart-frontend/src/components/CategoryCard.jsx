import React from 'react';
import { ChevronLeft } from 'lucide-react';

const CategoryCard = ({ category, onSelectCategory }) => (
  <div
    className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer border border-gray-100 flex flex-col justify-between"
    onClick={() => onSelectCategory(category.name)}
  >
    <div>
      <div className="text-4xl mb-4">{category.icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight">{category.name}</h3>
      <p className="text-sm text-gray-500 min-h-[2.5rem]">{category.description}</p>
    </div>
    <button className="mt-4 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors flex items-center">
      Shop Now
      <ChevronLeft size={16} className="rotate-180 ml-1" />
    </button>
  </div>
);

export default CategoryCard;