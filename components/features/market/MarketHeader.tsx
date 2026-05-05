'use client';

import React from 'react';
import { useUserContext } from '@/context/UserContext';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface MarketHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export function MarketHeader({ cartCount, onOpenCart }: MarketHeaderProps) {
  const { username, tokens } = useUserContext();

  return (
    <header className="flex items-center w-full relative z-50 h-[46px] px-0.5 gap-2">
      {/* Branding - Personalized Greeting */}
      <div className="flex flex-shrink-0">
        <h1 
          style={{ fontFamily: 'var(--font-avigea)' }}
          className="text-sm sm:text-base tracking-tight"
        >
          <span className="text-[#07120b]">Hola, </span>
          <span className="text-white">{username}!</span>
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-end gap-3">
        {/* Tokens Display */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#07120b] shadow-lg shadow-black/20 border border-white/5">
          <span className="text-lg font-black text-white tracking-tight leading-none">
            {tokens.toLocaleString()} <span className="text-[#A3E635] text-[10px] ml-1">TOKENS</span>
          </span>
        </div>

        {/* Cart Button - CIRCULAR */}
        <button 
          onClick={onOpenCart}
          className="relative w-11 h-11 bg-[#07120b] border-2 border-[#07120b] rounded-full flex items-center justify-center text-[#A3E635] shadow-lg shadow-black/10 hover:bg-black hover:scale-105 transition-all duration-300 active:scale-95"
        >
          <ShoppingCart size={20} strokeWidth={2.5} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#07120b] text-[10px] font-black flex items-center justify-center border-2 border-[#07120b] rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
