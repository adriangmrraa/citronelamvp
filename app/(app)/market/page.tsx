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
import { Plus, User, ShoppingCart, Package, Calendar, Tag } from 'lucide-react';
import { useUserContext } from '@/context/UserContext';

export default function MarketPage() {
  const { username, addTransaction, transactions } = useUserContext();
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
    clearCart,
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
    if (cart.length === 0) return;
    
    notify("Procesando compra...");
    // Simular proceso
    await new Promise(r => setTimeout(r, 1000));
    
    // Registrar transacciones reales en el contexto
    cart.forEach(item => {
      addTransaction({
        type: 'purchase',
        title: item.product.name,
        amount: `-${item.product.price * item.quantity} TOKENS`,
        tokensValue: -(item.product.price * item.quantity),
        description: `Compra de ${item.quantity}x en Market`
      });
    });
    
    clearCart();
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

        <section className="space-y-4 pt-4">
          <div className="flex items-end justify-between">
            <h2 
              style={{ fontFamily: 'var(--font-avigea)' }}
              className="text-2xl text-white tracking-wide"
            >
              {activeTab === 'Historial' ? "Tu Historial de Compras" : (category === "Todos" ? "Todos los productos" : category)}
            </h2>
          </div>

          {activeTab === 'Historial' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {transactions.filter(tx => tx.type === 'purchase').length === 0 ? (
                <div className="p-20 text-center bg-zinc-900/10 border border-dashed border-white/10">
                  <ShoppingCart className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-500 font-medium tracking-tight">Todavía no realizaste ninguna compra.</p>
                  <Button 
                    variant="link" 
                    className="text-[#A3E635] mt-2"
                    onClick={() => setActiveTab('Todos')}
                  >
                    Explorar productos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-1 border-t border-white/5">
                  {transactions.filter(tx => tx.type === 'purchase').map((tx) => (
                    <div 
                      key={tx.id} 
                      className="p-6 bg-zinc-900/20 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-zinc-900/40 transition-all"
                    >
                      <div className="flex gap-5 items-center">
                        <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5">
                          <Package className="w-6 h-6 text-[#A3E635]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white uppercase tracking-tight text-lg">{tx.title}</h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span className="text-[10px] text-zinc-500 flex items-center gap-1 uppercase tracking-widest">
                              <Calendar className="w-3 h-3" /> {tx.date}
                            </span>
                              <Tag className="w-3 h-3" /> Market
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end md:gap-12 w-full md:w-auto pt-4 md:pt-0 border-t md:border-none border-white/5">
                        <div className="text-right">
                          <p className="text-xl font-black text-white">{tx.amount}</p>
                          <p className="text-[10px] text-[#A3E635] font-black uppercase tracking-widest mt-0.5">Transacción Completada</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <MarketGrid 
              products={products}
              isLoading={isLoading}
              error={error}
              onAddToCart={handleAddToCart}
            />
          )}
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
