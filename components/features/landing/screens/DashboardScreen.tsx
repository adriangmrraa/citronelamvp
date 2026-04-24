import React from 'react';

export const DashboardScreen = () => {
  return (
    <div className="h-full px-4 pt-4 text-white text-[11px] space-y-3">
      <div data-phone-item className="flex items-center justify-between">
        <div>
          <p className="text-[9px] text-zinc-500 uppercase tracking-wider">Bienvenido</p>
          <p className="text-[14px] font-bold">Hola, Adrian</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-[12px] font-bold text-[#07120b]">
          A
        </div>
      </div>
      <div data-phone-item className="grid grid-cols-3 gap-2">
        {[
          { n: '3', l: 'Cultivos', c: 'from-lime-400/20 to-lime-400/5' },
          { n: '12', l: 'Registros', c: 'from-emerald-400/20 to-emerald-400/5' },
          { n: '5', l: 'Pedidos', c: 'from-amber-400/20 to-amber-400/5' },
        ].map((s) => (
          <div key={s.l} className={`p-2.5 rounded-xl bg-gradient-to-b ${s.c} border border-white/5`}>
            <p className="text-[16px] font-black">{s.n}</p>
            <p className="text-[8px] text-zinc-400 uppercase tracking-wider">{s.l}</p>
          </div>
        ))}
      </div>
      <div>
        <p data-phone-item className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Cultivos Activos
        </p>
        {[
          { name: 'Blue Dream', phase: 'Vegetativo', week: 'Sem 4', ph: '6.2', ec: '1.4' },
          { name: 'OG Kush', phase: 'Floración', week: 'Sem 7', ph: '6.0', ec: '1.8' },
          { name: 'Amnesia Haze', phase: 'Secado', week: 'Sem 12', ph: '—', ec: '—' },
        ].map((c) => (
          <div
            data-phone-item
            key={c.name}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 mb-1.5"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-lime-400/30 to-green-600/30 flex items-center justify-center text-[16px]">
              🌱
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold truncate">{c.name}</p>
              <p className="text-[9px] text-lime-400/70">
                {c.phase} · {c.week}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-zinc-500">pH {c.ph}</p>
              <p className="text-[9px] text-zinc-500">EC {c.ec}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#0a0a0a]/90 backdrop-blur-sm border-t border-white/5 flex items-center justify-around px-2">
        {['🏠', '🌱', '🛒', '👥', '👤'].map((icon, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-0.5 ${i === 0 ? 'text-lime-400' : 'text-zinc-500'}`}
          >
            <span className="text-[16px]">{icon}</span>
            <span className="text-[7px]">
              {['Inicio', 'Cultivo', 'Mercado', 'Social', 'Perfil'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
