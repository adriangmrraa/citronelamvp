"use client";

import React from 'react';

const categories = [
  { id: 'Todos', label: 'Todos', icon: 'public' },
  { id: 'Sustratos', label: 'Sustratos', icon: 'grass' },
  { id: 'Nutrientes', label: 'Nutrientes', icon: 'science' },
  { id: 'Semillas', label: 'Semillas', icon: 'eco' },
  { id: 'Equipamiento', label: 'Equipamiento', icon: 'handyman' },
  { id: 'Kits', label: 'Kits', icon: 'inventory_2' },
];

interface CategoriesRibbonProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoriesRibbon = ({ selectedCategory, onCategoryChange }: CategoriesRibbonProps) => {
  return (
    <nav className="flex items-center gap-8 overflow-x-auto hide-scrollbar pt-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className="group relative pb-2 flex items-center gap-2 transition-all focus:outline-none whitespace-nowrap"
        >
          <span className={`material-symbols-outlined text-[20px] transition-colors ${
            selectedCategory === cat.id ? 'text-[#07120b]' : 'text-[#07120b]/50 group-hover:text-[#07120b]'
          }`}>
            {cat.icon}
          </span>
          <span className={`text-sm font-black transition-colors ${
            selectedCategory === cat.id ? 'text-[#07120b]' : 'text-[#07120b]/50 group-hover:text-[#07120b]'
          }`}>
            {cat.label}
          </span>
          
          {/* Active Underline */}
          {selectedCategory === cat.id && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#07120b] transition-all" />
          )}
        </button>
      ))}
    </nav>
  );
};

export default CategoriesRibbon;
