'use client';

import React from 'react';

const categories = [
  { id: 1, label: 'Eventos', icon: 'celebration' },
  { id: 2, label: 'Charlas', icon: 'forum' },
  { id: 3, label: 'Growshops', icon: 'local_florist' },
  { id: 4, label: 'Talleres', icon: 'build' },
];

export function CategoriesRibbon() {
  return (
    <section>
      <div className="flex justify-around md:justify-start md:gap-20 items-center pt-2 pb-4">
        {categories.map((cat) => (
          <button 
            key={cat.id}
            className="flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 focus:outline-none group"
          >
            <span className="material-symbols-outlined text-[36px] text-[#a3e635] font-light drop-shadow-[0_0_10px_rgba(163,230,53,0.15)] group-hover:drop-shadow-[0_0_15px_rgba(163,230,53,0.4)] transition-all">
              {cat.icon}
            </span>
            <span className="text-[13px] font-medium text-zinc-300 group-hover:text-white transition-colors tracking-wide">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
