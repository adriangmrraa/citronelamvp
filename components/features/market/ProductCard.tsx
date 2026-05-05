"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/market';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Link 
      href={`/market/${product.id}`}
      className="group bg-zinc-900/40 overflow-hidden rounded-none border border-white/5 transition-all duration-500 hover:border-primary/30 block"
      data-product-card
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-[#07120b]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Cart Button (Bottom Right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 z-20 border-none"
          style={{ backgroundColor: '#A3E635' }}
          title="Agregar al carrito"
        >
          <ShoppingCart className="w-3.5 h-3.5 stroke-[1.5] text-white" />
        </button>


        {product.isLastUnit && (
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-[#A3E635] text-[#07120b] px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-none">
              ¡ULTIMA!
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <h3 
          style={{ fontFamily: 'var(--font-inter)' }}
          className="text-[13px] sm:text-sm font-bold leading-tight text-white tracking-wide min-h-[2.5rem]"
        >
          {product.name}
        </h3>

        {/* Pricing & Discounts */}
        <div className="space-y-1">
          {product.discountPercentage ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[#A3E635] text-sm sm:text-base font-black tracking-tight">
                {product.discountPercentage}% OFF
              </span>
              <span className="text-zinc-500 text-xs sm:text-sm line-through opacity-50">
                {product.originalPrice?.toLocaleString()}
              </span>
            </div>
          ) : (
            <div className="h-4 sm:h-6" /> // Spacer for alignment
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-3xl font-black text-white tracking-tighter">
                {product.price.toLocaleString()}
              </span>
              <span 
                className="text-[9px] sm:text-xs font-black text-[#A3E635] uppercase tracking-tight"
              >
                TOKENS
              </span>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
              {product.hasFreeShipping && (
                <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-[#A3E635]/90 font-bold tracking-wide">
                  <span className="material-symbols-outlined text-[12px] sm:text-sm">local_shipping</span>
                  <span className="hidden sm:inline">Envío gratis</span>
                </div>
              )}
              <span className="text-[9px] sm:text-[10px] text-zinc-500 font-bold whitespace-nowrap">
                +{product.soldCount} vendidos
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
