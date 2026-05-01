'use client';

export function DashboardHeader() {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div /> {/* Spacer for flex layout if needed, or empty container */}
      <div className="flex gap-4">
        <button className="bg-primary text-black px-8 py-3 rounded-xl font-sans text-[10px] tracking-widest uppercase hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 font-bold">
          <span className="material-symbols-outlined text-sm">add</span> Nuevo Lote
        </button>
        <button className="bg-zinc-900/50 text-zinc-300 px-6 py-3 rounded-xl font-sans text-[10px] tracking-widest uppercase hover:bg-zinc-800 transition-all flex items-center gap-2 border border-zinc-800">
          <span className="material-symbols-outlined text-sm">download</span> Exportar Reporte
        </button>
      </div>
    </section>
  );
}
