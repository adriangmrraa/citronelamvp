'use client';

import { useState } from 'react';

export default function NutrientCalculator() {
  const [grow, setGrow] = useState(10);
  const [micro, setMicro] = useState(5);
  const [bloom, setBloom] = useState(10);
  const [volume, setVolume] = useState(20);

  const growMl = +(grow * volume).toFixed(1);
  const microMl = +(micro * volume).toFixed(1);
  const bloomMl = +(bloom * volume).toFixed(1);
  const totalMl = +(growMl + microMl + bloomMl).toFixed(1);

  const inputClass = 'w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition';
  const labelClass = 'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1';

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-[#16A34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Calculadora de Nutrientes</h3>
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
        <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-3 text-center">
          <p className="text-xs font-medium text-green-700 dark:text-green-400">Grow</p>
          <p className="text-xl font-bold text-green-800 dark:text-green-300">{growMl} ml</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 text-center">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Micro</p>
          <p className="text-xl font-bold text-blue-800 dark:text-blue-300">{microMl} ml</p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-3 text-center">
          <p className="text-xs font-medium text-purple-700 dark:text-purple-400">Bloom</p>
          <p className="text-xl font-bold text-purple-800 dark:text-purple-300">{bloomMl} ml</p>
        </div>
        <div className="bg-amber-100 dark:bg-amber-900/30 rounded-xl p-3 text-center">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Total</p>
          <p className="text-xl font-bold text-amber-800 dark:text-amber-300">{totalMl} ml</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
        Para {volume}L de solución — ratios en ml/L
      </p>
    </div>
  );
}
