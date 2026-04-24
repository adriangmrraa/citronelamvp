'use client';

import Link from 'next/link';

export function ExpandCropCard() {
  return (
    <div className="glass-surface p-8 rounded-2xl group hover:border-primary/40 transition-all duration-500 relative overflow-hidden flex flex-col justify-between border-dashed border-zinc-700 bg-zinc-900/10">
      <div className="flex flex-col mb-4">
        <h3 
          style={{ fontFamily: 'var(--font-avigea)' }}
          className="text-3xl font-normal text-zinc-500 group-hover:text-primary transition-colors tracking-wide"
        >
          Expandir Cultivo
        </h3>
        <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-zinc-600 mt-2">
          Slot disponible para nuevo lote
        </p>
      </div>

      <div className="flex-grow flex flex-col justify-center items-center py-12 space-y-6">
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-700 group-hover:border-primary/40 group-hover:text-primary transition-all">
          <span className="material-symbols-outlined text-4xl">add_circle</span>
        </div>
        <p className="text-center text-zinc-400 text-xs font-sans max-w-[200px] leading-relaxed uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
          ¡Tu laboratorio tiene espacio para más! Adquiere nuevas semillas y variedades únicas.
        </p>
      </div>

      <div className="space-y-3">
        <Link 
          href="/market"
          className="w-full bg-zinc-900/50 text-white border border-zinc-800 px-6 py-3 rounded-xl font-sans text-[10px] tracking-widest uppercase hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center justify-center gap-2"
        >
          Ir al Marketplace <span className="material-symbols-outlined text-sm">shopping_cart</span>
        </Link>
        <Link 
          href="/market/seeds"
          className="w-full bg-transparent text-zinc-500 border border-transparent px-6 py-2 rounded-xl font-sans text-[10px] tracking-widest uppercase hover:text-white transition-all flex items-center justify-center gap-2"
        >
          Ver Catálogo de Semillas
        </Link>
      </div>

      {/* Decorative pulse for the empty slot */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
    </div>
  );
}
