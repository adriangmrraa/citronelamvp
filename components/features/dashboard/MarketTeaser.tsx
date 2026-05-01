'use client';

export function MarketTeaser() {
  return (
    <div className="glass-surface p-8 rounded-2xl h-full flex flex-col">
      <h2 className="font-display text-2xl font-medium mb-2 text-white tracking-widest">Tu Mercado</h2>
      <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-8">Suministros Premium Citronela</p>
      
      <div className="space-y-4 flex-grow">
        <div className="p-6 rounded-xl bg-zinc-900/40 hover:bg-zinc-800 transition-all border-l-4 border-primary group cursor-pointer border border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-zinc-950 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">genetics</span>
            </div>
            <div>
              <h4 className="font-display text-lg font-medium text-zinc-100 tracking-widest">Bóveda Genética</h4>
              <p className="text-[10px] text-zinc-500 font-sans uppercase tracking-wider">Semillas híbridas y variedades únicas</p>
            </div>
            <span className="material-symbols-outlined ml-auto text-primary group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-zinc-900/40 hover:bg-zinc-800 transition-all border-l-4 border-primary group cursor-pointer border border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-zinc-950 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">science</span>
            </div>
            <div>
              <h4 className="font-display text-lg font-medium text-zinc-100 tracking-widest">Bio-Labs de Nutrientes</h4>
              <p className="text-[10px] text-zinc-500 font-sans uppercase tracking-wider">Soluciones hidropónicas de precisión</p>
            </div>
            <span className="material-symbols-outlined ml-auto text-primary group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-zinc-800/50">
        <div className="relative rounded-xl overflow-hidden aspect-video group">
          <img 
            alt="Laboratorio Citronela" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
            src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=800" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
          <div className="absolute bottom-4 left-4">
            <span className="bg-primary text-black px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest">Nueva Variedad</span>
          </div>
        </div>
      </div>
    </div>
  );
}
