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
      <div className="p-4 space-y-3">
        <h3 
          style={{ fontFamily: 'var(--font-inter)' }}
          className="text-sm font-medium leading-tight text-white tracking-wide line-clamp-2 min-h-[2.5rem]"
        >
          {product.name}
        </h3>

        {/* Pricing & Discounts */}
        <div className="space-y-1">
          {product.discountPercentage ? (
            <div className="flex items-center gap-2">
              <span className="text-[#A3E635] text-base font-bold tracking-tight">
                {product.discountPercentage}% OFF
              </span>
              <span className="text-zinc-500 text-sm line-through">
                {product.originalPrice?.toLocaleString()}
              </span>
            </div>
          ) : (
            <div className="h-6" /> // Spacer for alignment
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white tracking-tighter">
                {product.price.toLocaleString()}
              </span>
              <span 
                style={{ fontFamily: 'var(--font-avigea)' }}
                className="text-xs font-normal text-[#A3E635] tracking-[0.1em]"
              >
                TOKENS
              </span>
            </div>
            <div className="flex flex-col items-end">
              {product.hasFreeShipping && (
                <div className="flex items-center gap-1 text-[11px] text-[#A3E635]/90 font-light tracking-wide mb-0.5">
                  <span className="material-symbols-outlined text-sm">local_shipping</span>
                  <span>Envío gratis</span>
                </div>
              )}
              <span className="text-[10px] text-zinc-500 font-medium whitespace-nowrap">
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
