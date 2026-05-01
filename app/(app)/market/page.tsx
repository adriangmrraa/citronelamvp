"use client";

import React, { useState } from 'react';
import { useMarket } from '@/hooks/useMarket';
import { useCart } from '@/hooks/useCart';
import { MarketHeader } from '@/components/features/market/MarketHeader';
import { CategoriesRibbon } from '@/components/features/market/CategoriesRibbon';
import { FiltersRibbon } from '@/components/features/market/FiltersRibbon';
import { MarketCarousel } from '@/components/features/market/MarketCarousel';
import { MarketGrid } from '@/components/features/market/MarketGrid';
import ProductForm from '@/components/market/ProductForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function MarketPage() {
  const { 
    products, 
    isLoading, 
    error, 
    search, 
    setSearch, 
    category, 
    setCategory,
    refreshProducts,
    activeTab,
    setActiveTab
  } = useMarket();

  const {
    cart,
    isOpen: isCartOpen,
    setIsOpen: setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice
  } = useCart();

  const [showProductForm, setShowProductForm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    notify(`${product.name} agregado al carrito`);
  };

  const handleConfirmPurchase = async () => {
    notify("Procesando compra...");
    // Simular proceso
    await new Promise(r => setTimeout(r, 1000));
    notify("¡Compra realizada con éxito!");
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen text-zinc-200 pb-24 font-sans">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="glass-surface border-primary/30 px-6 py-3 rounded-2xl shadow-glow-lime/20 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">check_circle</span>
            <span className="text-sm font-medium text-white">{notification}</span>
          </div>
        </div>
      )}

      <div className="relative z-20">
        {/* Solid Green Header Area */}
        <div className="bg-[#A3E635] pt-3 pb-1 px-6 md:px-12 border-b border-[#07120b]/5">
          <div className="max-w-[2000px] mx-auto">
            <MarketHeader 
              searchTerm={search} 
              onSearchChange={setSearch} 
              cartCount={totalItems}
              onOpenCart={() => setIsCartOpen(true)}
            />
            <div className="mt-1">
              <CategoriesRibbon 
                selectedCategory={category} 
                onCategoryChange={setCategory} 
              />
            </div>
          </div>
        </div>

        {/* Gradient Transition Area (Behind Carousel) */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#A3E635] via-[#A3E635] via-40% to-transparent pointer-events-none -z-10" />
          <div className="w-full py-1">
            <MarketCarousel />
          </div>
        </div>
      </div>

      <main className="px-6 md:px-12 space-y-2 relative z-10 max-w-[2000px] mx-auto">
        <div className="flex flex-col gap-2">
          <FiltersRibbon 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <h2 
              style={{ fontFamily: 'var(--font-avigea)' }}
              className="text-2xl text-white tracking-wide"
            >
              {category === "Todos" ? "Todos los productos" : category}
            </h2>
          </div>

          <MarketGrid 
            products={products}
            isLoading={isLoading}
            error={error}
            onAddToCart={handleAddToCart}
          />
        </section>
      </main>

      {/* Overlays */}
      {showProductForm && (
        <ProductForm
          onSuccess={() => {
            setShowProductForm(false);
            notify('¡Producto publicado con éxito!');
            refreshProducts();
          }}
          onCancel={() => setShowProductForm(false)}
        />
      )}
    </div>
  );
}
