'use client';

const days = ['Lun', 'Mie', 'Vie', 'Dom', 'Mar', 'Jue'];
const bars = [45, 60, 55, 80, 95, 75, 65, 50, 40, 60, 85, 90];

export function GrowthChart() {
  return (
    <div className="lg:col-span-2 glass-surface p-8 rounded-2xl">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="font-display text-2xl font-medium text-white tracking-widest">Métricas de Crecimiento</h2>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Análisis de Datos Agregados (Últimos 14 días)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary inline-block animate-pulse shadow-[0_0_8px_rgba(163,230,53,0.5)]"></span>
          <span className="font-sans text-[10px] uppercase tracking-widest text-zinc-400">Ciclo de Fotosíntesis</span>
        </div>
      </div>

      <div className="h-64 relative flex items-end gap-2 px-4 mb-4">
        {bars.map((height, i) => (
          <div 
            key={i}
            className={`flex-1 bg-primary/20 rounded-t-lg border-t-2 border-primary group relative transition-all duration-500 hover:bg-primary/40`}
            style={{ height: `${height}%` }}
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-zinc-900 border border-primary/50 text-[10px] text-primary px-2 py-1 rounded transition-opacity shadow-glow-lime whitespace-nowrap z-10">
              {height}% Óptimo
            </div>
            {height > 80 && (
              <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-primary/30 to-transparent rounded-t-lg shadow-[0_-5px_15px_rgba(163,230,53,0.2)]" />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between px-4 font-sans text-[10px] text-zinc-500 tracking-widest uppercase">
        {days.map(day => <span key={day}>{day}</span>)}
      </div>
    </div>
  );
}
