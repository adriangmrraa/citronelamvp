'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMarket } from '@/hooks/useMarket';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/hooks/useUser';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import CheckoutTerminal from '@/components/features/market/CheckoutTerminal';
import CartCheckoutSummary from '@/components/features/market/CartCheckoutSummary';
import TokenStatus from '@/components/features/market/TokenStatus';

import gsap from 'gsap';

export default function CartCheckoutPage() {
  const router = useRouter();
  const { products } = useMarket();
  const { cart, clearCart } = useCart();
  const { user, spendTokens } = useUser();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [transactionId, setTransactionId] = React.useState<string>('');
  const [finalTotal, setFinalTotal] = React.useState<number>(0);
  const [purchasedItems, setPurchasedItems] = React.useState<any[]>([]);
  const [selectedProductDetail, setSelectedProductDetail] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleConfirm = async () => {
    if (cart.length === 0) return;
    
    if (user.tokens < totalPrice) {
      setError('Tokens insuficientes para completar el canje.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);

    // GSAP Animation for terminal "authorization"
    gsap.to('.terminal-overlay', {
      opacity: 0.8,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: 'power2.inOut'
    });

    // Mock processing delay
    setTimeout(() => {
      const generatedId = spendTokens(totalPrice, `Canje múltiple de carrito`);
      
      if (generatedId) {
        setTransactionId(generatedId);
        setFinalTotal(totalPrice);
        setPurchasedItems([...cart]);
        clearCart();
        setIsProcessing(false);
        setIsCompleted(true);
      } else {
        setIsProcessing(false);
        setError('Error en la autorización de tokens.');
      }
    }, 3000);
  };

  if (cart.length === 0 && !isCompleted) {
    return (
      <div className="min-h-screen bg-[#07120b] flex flex-col items-center justify-center text-white gap-4">
        <p className="text-xl font-medium opacity-50">Tu carrito está vacío</p>
        <Button onClick={() => router.push('/market')} variant="outline">
          Volver al Market
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-100 font-sans relative overflow-hidden bg-[#07120b]">
      {/* Background Dimmer for Focus */}
      <div className="fixed inset-0 bg-black/60 z-20 pointer-events-none" />

      {!isProcessing && !isCompleted && (
        <nav className="relative z-30 h-16 flex items-center px-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-[#A3E635] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Cancelar Transacción
          </button>
        </nav>
      )}

      <main className="relative z-30 max-w-2xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-in fade-in duration-700 w-full">
              <h1 
                style={{ fontFamily: 'var(--font-avigea)' }}
                className="text-4xl tracking-tight absolute top-12"
              >
                <span className="text-[#A3E635]">Citro</span>
                <span className="text-white">market</span>
              </h1>

              <div className="flex flex-col items-center space-y-8">
                <div className="relative">
                  <div className="w-24 h-24 border-2 border-lime-400/20 rounded-full" />
                  <div className="absolute inset-0 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-lime-400/10 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Autorizando Tokens</h2>
                </div>
              </div>
            </div>
          ) : isCompleted ? (
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(163,230,53,0.4)]">
                  <svg className="w-8 h-8 text-[#07120b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-1">
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Transacción Confirmada</h2>
                </div>
              </div>

              <div className="glass-surface border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="p-8 border-b border-white/5 bg-white/[0.03] relative">
                   <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 italic">Resumen de transacción</h3>
                   <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {purchasedItems.map((item) => (
                        <div key={item.product.id} className="flex gap-4 p-3 bg-white/[0.01] rounded-2xl border border-white/5 items-end">
                           <div className="w-14 h-14 relative rounded-xl overflow-hidden border border-white/5 flex-shrink-0">
                             <img src={item.product.image} alt={item.product.name} className="object-cover w-full h-full" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-white truncate uppercase">{item.product.name}</p>
                              <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">CANTIDAD: {item.quantity}</p>
                           </div>
                           <div className="text-right">
                              <div className="flex items-baseline gap-1">
                                <span className="text-xl font-black text-white tracking-tighter">{(item.product.price * item.quantity).toLocaleString()}</span>
                                <span className="text-[8px] font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="p-8 bg-black/40 space-y-4">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-4">
                      <span className="text-zinc-500">ID de Transacción</span>
                      <span className="text-white font-medium">{transactionId}</span>
                   </div>
                   
                   <div className="space-y-4 pt-2">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Gastado</span>
                         <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-white tracking-tighter">-{finalTotal.toLocaleString()}</span>
                            <span className="text-[10px] font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
                         </div>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Tokens Disponibles</span>
                         <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white tracking-tighter">{(user?.tokens ?? 0).toLocaleString()}</span>
                            <span className="text-[10px] font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
                 <h3 className="text-white font-black uppercase text-left text-sm tracking-widest">¿QUÉ SIGUE?</h3>
                 <p className="text-zinc-400 text-xs leading-relaxed font-medium text-left">
                    Pronto el equipo de <span className="text-lime-400 font-black">Citro</span><span className="text-white font-black">nela</span> se comunicará con vos a través de tus datos de contacto para coordinar la entrega y los métodos de envío de tus productos.
                 </p>
                 <div className="pt-2">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] text-left">Gracias por confiar en nosotros.</p>
                 </div>
              </div>

              <div className="flex flex-col gap-3">
                 <Button 
                   onClick={() => router.push('/profile?tab=wallet')}
                   className="w-full py-6 bg-lime-400 text-[#07120b] hover:bg-lime-300 font-black uppercase tracking-widest rounded-2xl"
                 >
                    Ver mi Billetera
                 </Button>
                 <Button 
                   onClick={() => router.push('/market')}
                   variant="ghost"
                   className="w-full py-6 text-zinc-400 hover:text-white font-black uppercase tracking-widest"
                 >
                    Seguir Comprando
                 </Button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-rose-500 text-xs font-bold animate-in fade-in zoom-in w-full">
                  {error}
                </div>
              )}

              <CheckoutTerminal onConfirm={handleConfirm} isProcessing={isProcessing}>
                <div className="space-y-6">
                    <CartCheckoutSummary 
                      items={cart} 
                      totalPrice={totalPrice} 
                      onItemClick={setSelectedProductDetail}
                    />
                    <TokenStatus price={totalPrice} />
                </div>
              </CheckoutTerminal>
            </>
          )}
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
            onClick={() => setSelectedProductDetail(null)}
          />
          <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="relative h-64 w-full">
               <img src={selectedProductDetail.image} alt={selectedProductDetail.name} className="w-full h-full object-cover" />
               <button 
                 onClick={() => setSelectedProductDetail(null)}
                 className="absolute top-6 right-6 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
               >
                 <ChevronLeft className="w-6 h-6 rotate-180" />
               </button>
            </div>
            <div className="p-10 space-y-6">
               <div className="space-y-2">
                 <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{selectedProductDetail.name}</h2>
                 <p className="text-lime-400 text-xs font-black uppercase tracking-widest">{selectedProductDetail.category}</p>
               </div>
               <p className="text-zinc-400 text-sm leading-relaxed">
                 {selectedProductDetail.description || "Un producto premium de la línea Citronela, diseñado para maximizar tu experiencia."}
               </p>
               <div className="flex items-center justify-between pt-6 border-t border-white/5">
                 <div className="flex items-baseline gap-1">
                   <span className="text-3xl font-black text-white tracking-tighter">{selectedProductDetail.price.toLocaleString()}</span>
                   <span className="text-xs font-black text-[#A3E635] uppercase">TOKENS</span>
                 </div>
                 <Button 
                   onClick={() => setSelectedProductDetail(null)}
                   className="bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl px-8"
                 >
                   Cerrar
                 </Button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
