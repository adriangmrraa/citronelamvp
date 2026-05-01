"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Product } from '@/types/market';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface MarketGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onAddToCart: (product: Product) => void;
}

export const MarketGrid = ({ products, isLoading, error, onAddToCart }: MarketGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && products.length > 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('[data-product-card]');
      gsap.fromTo(
        cards,
        { 
          opacity: 0, 
          y: 20,
          scale: 0.95
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "all"
        }
      );
    }
  }, [isLoading, products]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 glass-surface rounded-3xl border-destructive/20 bg-destructive/5">
        <span className="material-symbols-outlined text-5xl text-destructive mb-4">error</span>
        <h3 className="text-xl font-bold text-white mb-2">¡Ups! Algo salió mal</h3>
        <p className="text-zinc-400 text-center max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 md:gap-6">
        {[...Array(12)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 glass-surface rounded-3xl">
        <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-white/5">
          <span className="material-symbols-outlined text-4xl text-zinc-600">search_off</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No encontramos productos</h3>
        <p className="text-zinc-400 text-center">Intentá con otros filtros o términos de búsqueda.</p>
      </div>
    );
  }

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
    >
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart} 
        />
      ))}
    </div>
  );
};

export default MarketGrid;
