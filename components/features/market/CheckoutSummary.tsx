'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/market';

interface CheckoutSummaryProps {
  product: Product;
}

export default function CheckoutSummary({ product }: CheckoutSummaryProps) {
  return (
    <div className="w-full flex flex-col md:flex-row gap-6 p-0">
      <div className="relative w-full md:w-32 aspect-square border border-white/5 overflow-hidden rounded-xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="space-y-1">
          <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Producto Seleccionado</h3>
          <p className="text-xl font-bold text-white tracking-tight leading-tight">
            {product.name}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Costo del Canje</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tracking-tighter">
              {product.price.toLocaleString()}
            </span>
            <span className="text-sm font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
