import React from 'react';

export const CultivoScreen = () => {
  return (
    <div className="h-full px-4 pt-3 text-white text-[11px]">
      <div data-phone-item className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-[10px]">←</div>
        <p className="text-[13px] font-bold flex-1">Blue Dream</p>
        <span className="px-2 py-0.5 rounded-full bg-lime-400/15 text-lime-400 text-[8px] font-semibold">
          Vegetativo
        </span>
      </div>
      <div
        data-phone-item
        className="relative h-28 rounded-2xl bg-gradient-to-b from-lime-400/10 to-transparent border border-lime-400/10 flex items-center justify-center mb-3 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(163,230,53,0.15),transparent_70%)]" />
        <span className="text-[48px] relative z-10">🌿</span>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[8px] text-zinc-400">
          <span>Semana 4 de 8</span>
          <span>50%</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <div
            data-gauge
            className="h-full w-0 bg-gradient-to-r from-lime-400 to-green-500 rounded-full"
          />
        </div>
      </div>
      <div data-phone-item className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-zinc-400 uppercase">pH</span>
            <span className="text-[14px] font-black text-lime-400">6.2</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              data-gauge
              className="h-full w-0 rounded-full bg-gradient-to-r from-yellow-400 via-lime-400 to-green-500"
            />
          </div>
          <p className="text-[7px] text-emerald-400 mt-1">Rango ideal</p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-zinc-400 uppercase">EC</span>
            <span className="text-[14px] font-black text-emerald-400">1.4</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              data-gauge
              className="h-full w-0 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400"
            />
          </div>
          <p className="text-[7px] text-emerald-400 mt-1">Rango ideal</p>
        </div>
      </div>
      <div data-phone-item className="p-3 rounded-xl bg-white/[0.03] border border-white/5 mb-3">
        <p className="text-[9px] text-zinc-400 uppercase tracking-wider mb-2">Nutrientes (ml/L)</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { n: 'N', v: '4.2', c: 'text-lime-400' },
            { n: 'P', v: '1.8', c: 'text-amber-400' },
            { n: 'K', v: '3.5', c: 'text-cyan-400' },
          ].map((x) => (
            <div key={x.n} className="text-center">
              <p className={`text-[13px] font-black ${x.c}`}>{x.v}</p>
              <p className="text-[8px] text-zinc-500">{x.n}</p>
            </div>
          ))}
        </div>
      </div>
      <p data-phone-item className="text-[9px] text-zinc-400 uppercase tracking-wider mb-1.5">
        Registros
      </p>
      {[
        { d: 'Hoy', n: 'Ajuste de pH a 6.2', t: '14:30' },
        { d: 'Ayer', n: 'Cambio solución nutritiva', t: '09:15' },
      ].map((l) => (
        <div
          data-phone-item
          key={l.d}
          className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5 mb-1"
        >
          <div className="w-1 h-6 rounded-full bg-lime-400/40" />
          <div className="flex-1">
            <p className="text-[10px] font-medium">{l.n}</p>
            <p className="text-[8px] text-zinc-500">
              {l.d} · {l.t}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
