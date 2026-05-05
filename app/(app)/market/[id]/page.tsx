'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMarket } from '@/hooks/useMarket';
import { useCart } from '@/hooks/useCart';
import { useParams, useRouter } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { products, isLoading } = useMarket();
  const { addToCart, setIsOpen: setIsCartOpen, totalItems } = useCart();

  // Buscamos el producto en el mock
  const product = products.find(p => p.id === Number(id));

  if (isLoading) return (
    <div className="min-h-screen bg-[#07120b] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#A3E635] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#07120b] flex flex-col items-center justify-center text-white gap-4">
      <p className="text-xl font-medium opacity-50">Producto no encontrado</p>
      <Button onClick={() => router.push('/market')} variant="outline" className="border-white/10">
        Volver al Market
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen text-zinc-100 pb-24 font-sans">
      {/* Top Navigation */}
      <div className="sticky top-0 z-30 bg-[#07120b]/80 backdrop-blur-md border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-[#A3E635] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Volver al Market
        </button>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsCartOpen(true)}
             className="relative p-2 rounded-full hover:bg-white/5 transition-colors group"
           >
             <ShoppingCart className="w-5 h-5 text-zinc-400 group-hover:text-[#A3E635] transition-colors" />
             {totalItems > 0 && (
               <div className="absolute top-0 right-0 w-4 h-4 bg-[#A3E635] text-[#07120b] text-[10px] font-black rounded-full flex items-center justify-center">
                 {totalItems}
               </div>
             )}
           </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-zinc-900 rounded-none overflow-hidden border border-white/5 shadow-2xl">
            <Image
              src={product.image || '/images/market/1.jpg'}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {product.discountPercentage && (
              <div className="absolute top-6 left-6 bg-[#A3E635] text-[#07120b] px-3 py-1 rounded-full font-black text-sm">
                {product.discountPercentage}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Product Info (ML Style Refinement) */}
        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
              Nuevo  |  +{product.soldCount} vendidos
            </p>
          </div>

          {/* Title & Rating Block */}
          <div className="space-y-2">
            <h1 
              style={{ fontFamily: 'var(--font-avigea)' }}
              className="text-3xl md:text-4xl text-white tracking-wide leading-[1.1]"
            >
              {product.name}
            </h1>
            
            {/* Rating System: [Rating] [Stars] ([Count]) */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{product.rating || '4.9'}</span>
              
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => {
                  const rating = product.rating || 4.9;
                  const fill = Math.max(0, Math.min(1, rating - (s - 1)));
                  
                  return (
                    <div key={s} className="w-3.5 h-3.5 text-[#A3E635]">
                      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
                        <defs>
                          <linearGradient id={`star-grad-${s}`}>
                            <stop offset={`${fill * 100}%`} stopColor="currentColor" />
                            <stop offset={`${fill * 100}%`} stopColor="transparent" />
                          </linearGradient>
                        </defs>
                        <path
                          fill={`url(#star-grad-${s})`}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>

              <span className="text-xs text-zinc-500">({product.ratingCount || '311'})</span>
            </div>
          </div>

          {/* Badge */}
          {product.discountPercentage && (
            <div className="inline-flex items-center gap-1.5 bg-[#A3E635]/10 border border-[#A3E635]/20 px-2 py-1 rounded-sm">
              <span className="material-symbols-outlined text-sm text-[#A3E635]">sell</span>
              <span className="text-[10px] font-black text-[#A3E635] uppercase tracking-widest">Oferta</span>
            </div>
          )}

          {/* Pricing Section */}
          <div className="space-y-1 pt-2">
            {product.originalPrice && (
              <div className="flex items-center justify-end gap-3">
                {product.discountPercentage && (
                  <span className="text-lg font-bold text-[#A3E635]">
                    {product.discountPercentage}% OFF
                  </span>
                )}
                <p className="text-lg text-zinc-500 line-through decoration-zinc-600">
                  {product.originalPrice.toLocaleString()} tokens
                </p>
              </div>
            )}
            <div className="flex items-start justify-end gap-3 w-full">
              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tighter leading-none">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-xl font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
                </div>
              </div>
            </div>
            {/* Sin cuotas ni medios de pago por pedido del usuario */}
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-6 border-t border-white/5">
            {product.hasFreeShipping ? (
              <div className="flex items-center gap-2 text-sm text-[#A3E635] font-bold mb-4">
                <Truck className="w-4 h-4" />
                <span>Envío gratis a todo el país</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium mb-4">
                <Truck className="w-4 h-4" />
                <span>Envío a coordinar con el vendedor</span>
              </div>
            )}

            <Button 
              onClick={() => router.push(`/market/checkout/${product.id}`)}
              className="w-full h-12 bg-[#A3E635] text-[#07120b] hover:bg-[#b4f346] font-black text-sm rounded-lg transition-all active:scale-[0.98]"
            >
              CANJEAR AHORA
            </Button>
            <Button 
              onClick={() => {
                addToCart(product);
                setIsCartOpen(true);
              }}
              variant="outline"
              className="w-full h-12 border-white/10 text-[#A3E635] hover:bg-[#A3E635]/5 font-bold text-sm rounded-lg transition-all"
            >
              AGREGAR AL CARRITO
            </Button>
          </div>

          {/* Protection Info */}
          <div className="flex items-center gap-3 pt-4 text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Compra Protegida</span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="md:col-span-2 pt-16 space-y-8">
          <div className="flex gap-8 border-b border-white/5">
            <button className="pb-4 border-b-2 border-[#A3E635] text-white font-bold text-sm tracking-wider">
              DESCRIPCIÓN
            </button>
            <button className="pb-4 border-b-2 border-transparent text-zinc-500 font-bold text-sm tracking-wider hover:text-zinc-300 transition-colors">
              ESPECIFICACIONES
            </button>
          </div>
          
          <div className="max-w-3xl">
            <p className="text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap font-light">
              {product.description}
              {"\n\n"}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Compromiso total de Citronela en cada entrega.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
