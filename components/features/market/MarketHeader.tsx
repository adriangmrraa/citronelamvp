"use client";

import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface MarketHeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const MarketHeader = ({ 
  searchTerm, 
  onSearchChange, 
  cartCount, 
  onOpenCart 
}: MarketHeaderProps) => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <header className="flex items-center w-full relative z-50 h-[46px] px-0.5 gap-2">
      {/* Branding - Siempre visible */}
      <div className="flex flex-shrink-0">
        <h1 
          style={{ fontFamily: 'var(--font-avigea)' }}
          className="text-2xl sm:text-3xl tracking-tight text-white"
        >
          <span className="text-[#07120b]">Citro</span>market
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-end">
        {!isSearchActive ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle */}
            <button 
              onClick={() => setIsSearchActive(true)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#07120b]/10 border border-[#07120b]/10 flex items-center justify-center text-[#07120b] hover:bg-[#07120b]/20 transition-all duration-300 focus:outline-none"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">search</span>
            </button>

            {/* Cart Button */}
            <button 
              onClick={onOpenCart}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border-none flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none group z-30"
              style={{ backgroundColor: '#07120b' }}
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5] text-[#A3E635] group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <div 
                  className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#A3E635]"
                  style={{ backgroundColor: 'white', color: '#07120b' }}
                >
                  {cartCount}
                </div>
              )}
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#07120b]/50 group-focus-within:text-[#07120b] transition-colors">
                <span className="material-symbols-outlined text-lg">search</span>
              </div>
              <input 
                autoFocus
                type="text" 
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscá lo que necesites..." 
                className="w-full bg-white/20 border border-[#07120b]/10 rounded-full py-1.5 pl-9 pr-3 text-sm text-[#07120b] placeholder-[#07120b]/40 focus:outline-none focus:border-[#07120b]/30 focus:bg-white/30 transition-all"
              />
            </div>
            <button 
              onClick={() => {
                setIsSearchActive(false);
                onSearchChange("");
              }}
              className="w-9 h-9 flex-shrink-0 rounded-full bg-[#07120b]/10 border border-[#07120b]/10 flex items-center justify-center text-[#07120b] hover:bg-[#07120b]/20 transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default MarketHeader;
