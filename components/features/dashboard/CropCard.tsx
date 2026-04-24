'use client';

interface CropCardProps {
  batch: string;
  name: string;
  ph: number;
  ec: number;
  currentDay: number;
  totalDays: number;
  icon: string;
  isAlternate?: boolean;
  camUrl?: string;
}

export function CropCard({ batch, name, ph, ec, currentDay, totalDays, icon, isAlternate, camUrl }: CropCardProps) {
  return (
    <div className={`glass-surface p-8 rounded-2xl group hover:border-primary/40 transition-all duration-500 relative overflow-hidden ${isAlternate ? 'bg-zinc-900/30' : ''}`}>
      <div className="flex flex-col mb-8">
        <h3 
          style={{ fontFamily: 'var(--font-avigea)' }}
          className="text-3xl font-normal text-[#a3e635] tracking-wide"
        >
          {name}
        </h3>
        <span className="absolute top-8 right-8 font-sans text-[10px] uppercase tracking-[0.3em] text-white">Lote {batch}</span>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-zinc-800/50 pb-4">
          <span className="font-sans text-[10px] uppercase tracking-widest text-white/90">Balance de pH</span>
          <span className="font-mono text-2xl text-[#a3e635] neon-glow-text">{ph}</span>
        </div>
        
        <div className="flex justify-between items-end border-b border-zinc-800/50 pb-4">
          <span className="font-sans text-[10px] uppercase tracking-widest text-white/90">Niveles de EC</span>
          <span className="font-mono text-2xl text-[#a3e635] neon-glow-text">
            {ec} <span className="text-[10px] font-sans text-[#a3e635]">ms/cm</span>
          </span>
        </div>
        
        <div className="flex justify-between items-end border-b border-zinc-800/50 pb-4">
          <span className="font-sans text-[10px] uppercase tracking-widest text-white/90">Día de Crecimiento</span>
          <span className="font-mono text-2xl text-[#a3e635] neon-glow-text">
            {currentDay} <span className="text-[10px] font-sans text-[#a3e635]">/ {totalDays}</span>
          </span>
        </div>

        {/* Camera Feed Section */}
        <div className="mt-8 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse" />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#a3e635] font-medium">Monitorización Activa</span>
          </div>
          
          {camUrl && (
            <div className="relative rounded-xl overflow-hidden aspect-square max-w-[280px] mx-auto border border-zinc-800 group-hover:border-primary/40 transition-all duration-500 shadow-inner bg-black">
              {/* Scanline / CRT Effect Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
              <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-black/20 to-transparent" />
              
              <img 
                src={camUrl} 
                alt={`${name} Feed`} 
                className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
