import React from 'react';
import { marketItems } from '../data';

export const MarketScreen = () => {
  return (
    <div className="h-full px-4 pt-3 text-white text-[11px]">
      <div
        data-phone-item
        className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.05] border border-white/5 mb-3"
      >
        <svg
          className="w-3.5 h-3.5 text-zinc-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="text-zinc-500 text-[10px]">Buscar productos...</span>
      </div>
      <div data-phone-item className="flex gap-1.5 mb-3 overflow-hidden">
        {['Todo', 'Genéticas', 'Nutrientes', 'Equipos'].map((f, i) => (
          <span
            key={f}
            className={`shrink-0 px-2.5 py-1 rounded-full text-[8px] font-semibold ${
              i === 0 ? 'bg-lime-400 text-[#07120b]' : 'bg-white/5 text-zinc-400 border border-white/5'
            }`}
          >
            {f}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {marketItems.map((p) => (
          <div
            data-phone-item
            key={p.name}
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
          >
            <div className="h-14 rounded-lg bg-gradient-to-b from-white/[0.04] to-transparent flex items-center justify-center text-[24px] mb-2">
              {p.e}
            </div>
            <p className="text-[10px] font-semibold truncate">{p.name}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[12px] font-black text-lime-400">{p.price}</span>
              <div className="flex items-center gap-0.5">
                <span className="text-[8px] text-amber-400">★</span>
                <span className="text-[8px] text-zinc-400">{p.r}</span>
              </div>
            </div>
            <p className="text-[7px] text-zinc-500 mt-0.5">{p.s} vendidos</p>
          </div>
        ))}
      </div>
    </div>
  );
}
