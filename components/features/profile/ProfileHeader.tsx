'use client';

import React from 'react';
import { useUserContext } from '@/context/UserContext';

export function ProfileHeader() {
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

      {/* Right: Tokens Display */}
      <div className="flex-1 flex items-center justify-end">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#07120b] shadow-lg shadow-black/20 border border-white/5">
          <span className="text-lg font-black text-white tracking-tight leading-none">
            {tokens.toLocaleString()} <span className="text-[#A3E635] text-[10px] ml-1">TOKENS</span>
          </span>
        </div>
      </div>
    </header>
  );
}
