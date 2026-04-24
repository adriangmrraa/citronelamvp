'use client';

import { useState } from 'react';
import { FlaskConical } from 'lucide-react';

export default function NutrientCalculator() {
  const [grow, setGrow] = useState(10);
  const [micro, setMicro] = useState(5);
  const [bloom, setBloom] = useState(10);
  const [volume, setVolume] = useState(20);

  const growMl = +(grow * volume).toFixed(1);
  const microMl = +(micro * volume).toFixed(1);
  const bloomMl = +(bloom * volume).toFixed(1);
  const totalMl = +(growMl + microMl + bloomMl).toFixed(1);

  const inputClass = 'w-full border border-white/[0.08] rounded-xl px-3 py-2 text-sm bg-white/[0.04] text-zinc-100 focus:ring-2 focus:ring-lime-400/50 focus:border-transparent outline-none transition';
  const labelClass = 'block text-xs font-medium text-zinc-500 mb-1';

  return (
    <div className="bg-white/[0.03] border border-lime-400/20 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <FlaskConical className="w-5 h-5 text-lime-400" />
        <h3 className="font-semibold text-zinc-100">Calculadora de Nutrientes</h3>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div>
          <label className={labelClass}>Grow (ml/L)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={grow}
            onChange={(e) => setGrow(parseFloat(e.target.value) || 0)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Micro (ml/L)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={micro}
            onChange={(e) => setMicro(parseFloat(e.target.value) || 0)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Bloom (ml/L)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={bloom}
            onChange={(e) => setBloom(parseFloat(e.target.value) || 0)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Volumen (L)</label>
          <input
            type="number"
            step="1"
            min="1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value) || 1)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-lime-400/10 rounded-xl p-3 text-center">
          <p className="text-xs font-medium text-lime-400">Grow</p>
          <p className="text-xl font-bold text-lime-300">{growMl} ml</p>
        </div>
        <div className="bg-blue-400/10 rounded-xl p-3 text-center">
          <p className="text-xs font-medium text-blue-400">Micro</p>
          <p className="text-xl font-bold text-blue-300">{microMl} ml</p>
        </div>
        <div className="bg-purple-400/10 rounded-xl p-3 text-center">
          <p className="text-xs font-medium text-purple-400">Bloom</p>
          <p className="text-xl font-bold text-purple-300">{bloomMl} ml</p>
        </div>
        <div className="bg-amber-400/10 rounded-xl p-3 text-center">
          <p className="text-xs font-medium text-amber-400">Total</p>
          <p className="text-xl font-bold text-amber-300">{totalMl} ml</p>
        </div>
      </div>

      <p className="text-xs text-zinc-600 mt-3 text-center">
        Para {volume}L de solución — ratios en ml/L
      </p>
    </div>
  );
}
