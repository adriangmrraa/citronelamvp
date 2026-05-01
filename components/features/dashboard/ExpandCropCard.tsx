'use client';

import React from 'react';
import Link from 'next/link';

export function ExpandCropCard() {
  return (
    <div className="group bg-zinc-900/40 overflow-hidden rounded-none border border-white/5 transition-all duration-500 hover:border-primary/30 flex flex-col relative min-h-[400px]">
      {/* Decorative Slot Area (Matching Camera Aspect) */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#07120b]/50 border-b border-white/5 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-700 group-hover:border-primary/40 group-hover:text-primary transition-all duration-500">
          <span className="material-symbols-outlined text-4xl">add_circle</span>
        </div>
        
        {/* Batch Badge Placeholder */}
        <div className="absolute top-3 right-3 z-20">
          <span className="bg-black/20 text-zinc-600 px-2 py-0.5 border border-zinc-800 rounded-none text-[9px] font-bold uppercase tracking-widest">
            SLOT LIBRE
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-sm font-medium leading-tight text-zinc-400 group-hover:text-white transition-colors tracking-wide mb-1"
          >
            Expandir Cultivo
          </h3>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-medium">
            Slot disponible para nuevo lote
          </p>
        </div>

        <div className="space-y-2">
          <Link 
            href="/market"
            className="w-full bg-white/5 hover:bg-[#A3E635] text-white hover:text-[#07120b] py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-white/5 hover:border-[#A3E635] flex items-center justify-center gap-2"
          >
            Ir al Marketplace <span className="material-symbols-outlined text-sm">shopping_cart</span>
          </Link>
          <Link 
            href="/market/seeds"
            className="w-full bg-transparent text-zinc-500 hover:text-white py-1 text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center"
          >
            Ver Catálogo de Semillas
          </Link>
        </div>
      </div>

      {/* Decorative pulse */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/2 rounded-full blur-3xl group-hover:bg-primary/5 transition-all duration-700"></div>
    </div>
  );
}
