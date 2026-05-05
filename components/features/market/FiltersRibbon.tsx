"use client";

import React from 'react';
import { FilterTab } from '@/hooks/useMarket';

const tabs: FilterTab[] = ['Todos', 'Más vendidos', 'Ofertas', 'Envío gratis', 'Historial'];

interface FiltersRibbonProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
}

export const FiltersRibbon = ({ activeTab, onTabChange }: FiltersRibbonProps) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-1 hide-scrollbar snap-x snap-mandatory items-center border-t border-white/5 pt-0">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`text-sm font-medium tracking-wide transition-all duration-300 snap-start whitespace-nowrap py-1 border-b-2`}
          style={{ 
            color: activeTab === tab ? '#A3E635' : undefined,
            borderColor: activeTab === tab ? '#A3E635' : 'transparent'
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default FiltersRibbon;
