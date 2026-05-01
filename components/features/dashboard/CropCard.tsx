'use client';

import React from 'react';
import Link from 'next/link';

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
  // Convertimos el batch a un ID numérico para la ruta si es necesario
  const cropId = parseInt(batch, 10);

  return (
    <div className="group bg-zinc-900/40 overflow-hidden rounded-none border border-white/5 transition-all duration-500 hover:border-[#A3E635]/30 block relative">
      {/* Image Container (Camera Feed) */}
      <Link href={`/cultivo/${cropId}`} className="block relative aspect-square w-full overflow-hidden bg-[#07120b]">
        {camUrl ? (
          <>
            {/* Scanline / CRT Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-black/40 to-transparent" />
            
            <img 
              src={camUrl} 
              alt={`${name} Feed`} 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-800">
            <span className="material-symbols-outlined text-4xl">videocam_off</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 space-y-4">
        <Link href={`/cultivo/${cropId}`} className="block hover:opacity-80 transition-opacity">
          <h3 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-sm font-medium leading-tight text-white tracking-wide mb-1"
          >
            {name}
          </h3>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
            Monitorización Hidropónica
          </p>
        </Link>

        {/* Stats Grid - 2 Rows of 3 */}
        <div className="grid grid-cols-3 gap-y-4 gap-x-2 pt-2 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">pH</span>
            <span className="text-xl font-black text-white tracking-tighter leading-none">{ph}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">EC</span>
            <span className="text-xl font-black text-[#A3E635] tracking-tighter leading-none">{ec}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">DÍA</span>
            <span className="text-xl font-black text-white tracking-tighter leading-none">
              {currentDay}<span className="text-[14px] text-zinc-500 font-normal ml-0.5">/{totalDays}</span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">TEMP</span>
            <span className="text-xl font-black text-white tracking-tighter leading-none">24.5<span className="text-[14px] text-zinc-500 font-normal ml-0.5">°C</span></span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">HUM</span>
            <span className="text-xl font-black text-white tracking-tighter leading-none">65<span className="text-[14px] text-zinc-500 font-normal ml-0.5">%</span></span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">AGUA</span>
            <span className="text-xl font-black text-white tracking-tighter leading-none">88<span className="text-[14px] text-zinc-500 font-normal ml-0.5">%</span></span>
          </div>
        </div>
        
        {/* Detail Button */}
        <div className="pt-2">
          <Link href={`/cultivo/${cropId}`} className="block">
            <button className="w-full bg-white/5 hover:bg-[#A3E635] text-white hover:text-[#07120b] py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-white/5 hover:border-[#A3E635]">
              Ver Detalles
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
