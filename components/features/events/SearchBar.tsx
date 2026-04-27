'use client';

import React from 'react';

export function SearchBar() {
  return (
    <div className="flex gap-4 items-center w-full">
      <div className="flex-1 relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-primary transition-colors">
          <span className="material-symbols-outlined">search</span>
        </div>
        <input 
          type="text" 
          placeholder="Search events..." 
          className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-primary/50 focus:bg-zinc-900/80 transition-all shadow-inner"
        />
      </div>
      <button className="h-[56px] w-[56px] flex-shrink-0 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex items-center justify-center hover:bg-primary/20 transition-colors shadow-[0_0_15px_rgba(163,230,53,0.05)]">
        <span className="material-symbols-outlined">tune</span>
      </button>
    </div>
  );
}
