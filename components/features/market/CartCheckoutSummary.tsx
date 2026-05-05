'use client';

import React from 'react';
import Image from 'next/image';
import { CartItem } from '@/types/market';
import { Package } from 'lucide-react';

interface CartCheckoutSummaryProps {
  items: CartItem[];
  totalPrice: number;
  onItemClick?: (product: any) => void;
}

export default function CartCheckoutSummary({ items, totalPrice, onItemClick }: CartCheckoutSummaryProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Productos en el Carrito ({items.length})</h3>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div 
            key={item.product.id} 
            className="flex gap-4 p-3 bg-white/[0.01] rounded-sm cursor-pointer hover:bg-white/5 transition-all group/item"
            onClick={() => onItemClick?.(item.product)}
          >
            <div className="relative w-16 h-16 overflow-hidden flex-shrink-0">
              {item.product.image ? (
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <Package className="w-6 h-6 text-zinc-700" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-sm font-bold text-white truncate">
                {item.product.name}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-zinc-500 uppercase font-black">
                  CANTIDAD: {item.quantity}
                </span>
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-white tracking-tighter">
                      {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                    <span className="text-[10px] font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
                  </div>
                  {item.quantity > 1 && (
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter italic">
                      Precio unitario: {item.product.price.toLocaleString()} <span className="text-[#A3E635] font-black uppercase tracking-tight">TOKENS</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex items-center justify-between border-b border-white/5 pb-4">
        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">TOTAL DEL CANJE</span>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-white tracking-tighter">
            {totalPrice.toLocaleString()}
          </span>
          <span className="text-sm font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
        </div>
      </div>
    </div>
  );
}
