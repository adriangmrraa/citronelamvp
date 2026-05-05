'use client';

import React from 'react';

const categories = [
  { id: 'Todos', label: 'Todos', icon: 'public' },
  { id: 'Eventos', label: 'Eventos', icon: 'celebration' },
  { id: 'Charlas', label: 'Charlas', icon: 'forum' },
  { id: 'Growshops', label: 'Growshops', icon: 'local_florist' },
  { id: 'Talleres', label: 'Talleres', icon: 'build' },
];

interface CategoriesRibbonProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export function CategoriesRibbon({ activeCategory, onCategoryChange }: CategoriesRibbonProps) {
  return (
    <nav className="flex items-center gap-8 overflow-x-auto hide-scrollbar pt-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className="group relative pb-2 flex items-center gap-2 transition-all focus:outline-none"
        >
          <span className={`material-symbols-outlined text-[20px] transition-colors ${
            activeCategory === cat.id ? 'text-[#07120b]' : 'text-[#07120b]/50 group-hover:text-[#07120b]'
          }`}>
            {cat.icon}
          </span>
          <span className={`text-sm font-black transition-colors ${
            activeCategory === cat.id ? 'text-[#07120b]' : 'text-[#07120b]/50 group-hover:text-[#07120b]'
          }`}>
            {cat.label}
          </span>
          
          {/* Active Underline */}
          {activeCategory === cat.id && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#07120b] transition-all" />
          )}
        </button>
      ))}
    </nav>
  );
}
