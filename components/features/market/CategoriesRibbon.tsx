"use client";

import React from 'react';

const categories = ["Todos", "Sustratos", "Nutrientes", "Semillas", "Equipamiento", "Kits"];

interface CategoriesRibbonProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoriesRibbon = ({ selectedCategory, onCategoryChange }: CategoriesRibbonProps) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-1 hide-scrollbar snap-x snap-mandatory items-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`text-sm font-medium tracking-wide transition-all duration-300 snap-start whitespace-nowrap py-1 border-b-2`}
          style={{ 
            color: selectedCategory === cat ? '#07120b' : 'rgba(7, 18, 11, 0.5)',
            borderColor: selectedCategory === cat ? '#07120b' : 'transparent'
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoriesRibbon;
