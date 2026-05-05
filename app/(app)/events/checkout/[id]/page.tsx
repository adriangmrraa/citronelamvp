'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Ticket, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { ALL_EVENTS } from '@/hooks/useEvents';
import gsap from 'gsap';

export default function EventCheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id;
  const catId = searchParams.get('cat');
  const router = useRouter();
  
  const { user, spendTokens, addReservation } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [eventDetail, setEventDetail] = useState<any>(null);

  const mockEvent = ALL_EVENTS.find(e => e.id === Number(id));
  
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (res.ok) {
          const data = await res.json();
          setEventDetail(data.event);
        } else if (mockEvent) {
          // Fallback to mock with categories
          setEventDetail({
            ...mockEvent,
            ticketCategories: [
              { id: 1, name: "General", price: mockEvent.price.includes('GRATIS') ? 0 : parseInt(mockEvent.price) }
            ]
          });
        }
      } catch (err) {
        if (mockEvent) {
          setEventDetail({
            ...mockEvent,
            ticketCategories: [
              { id: 1, name: "General", price: mockEvent.price.includes('GRATIS') ? 0 : parseInt(mockEvent.price) }
            ]
          });
        }
      }
    };
    fetchDetail();
  }, [id, mockEvent]);

  const selectedCat = eventDetail?.ticketCategories?.find((c: any) => c.id === Number(catId)) || eventDetail?.ticketCategories?.[0];
  const price = selectedCat?.price || 0;
  const categoryName = selectedCat?.name || "General";

  const handleConfirm = async () => {
    if (!eventDetail || !selectedCat) return;
    
    if (user.tokens < price) {
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
      const generatedId = spendTokens(price, `Reserva evento: ${eventDetail.title}`, undefined, eventDetail.id.toString());
      
      if (generatedId) {
        setTransactionId(generatedId);
        addReservation(eventDetail.id, categoryName, generatedId);
        setIsProcessing(false);
        setIsCompleted(true);
      } else {
        setIsProcessing(false);
        setError('Error en la autorización de tokens.');
      }
    }, 3000);
  };
  if (!eventDetail) return (
    <div className="min-h-screen bg-[#07120b] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen text-zinc-100 font-sans relative overflow-hidden bg-[#07120b]">
      {/* Background Dimmer for Focus */}
      <div className="fixed inset-0 bg-black/60 z-20 pointer-events-none" />

      {!isProcessing && !isCompleted && (
        <nav className="relative z-30 h-10 flex items-center px-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-[#A3E635] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Cancelar Transacción
          </button>
        </nav>
      )}

      <main className="relative z-30 max-w-2xl mx-auto px-6 py-4">
        <div className="flex flex-col items-center gap-4">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-in fade-in duration-700 w-full">
              <h1 
                style={{ fontFamily: 'var(--font-avigea)' }}
                className="text-4xl tracking-tight absolute top-12"
              >
                <span className="text-[#A3E635]">Citro</span>
                <span className="text-white">events</span>
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
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Autorizando Canje</h2>
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
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Reserva Confirmada</h2>
                </div>
              </div>

              <div className="w-full space-y-8">
                <div className="p-0 relative">
                   <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 italic">Detalles del evento</h3>
                   <div className="flex flex-col gap-6">
                      <div className="w-full aspect-square relative rounded-none overflow-hidden border border-white/5">
                         <img src={eventDetail.img || eventDetail.flyerUrl} alt={eventDetail.title} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="space-y-1">
                          <p 
                            style={{ fontFamily: 'var(--font-avigea)' }}
                            className="text-3xl text-white tracking-tight"
                          >
                            {eventDetail.title}
                          </p>
                          <p className="text-[10px] font-black text-[#A3E635] uppercase tracking-widest">{categoryName}</p>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-white tracking-tighter">{price.toLocaleString()}</span>
                          <span className="text-[8px] font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="py-8 space-y-4">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest pb-4">
                      <span className="text-zinc-500">ID de Reserva</span>
                      <span className="text-white font-medium">{transactionId}</span>
                   </div>
                   
                   <div className="space-y-4 pt-2">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Costo del canje</span>
                         <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-white tracking-tighter">-{price.toLocaleString()}</span>
                            <span className="text-[10px] font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
                         </div>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Tokens Disponibles</span>
                         <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white tracking-tighter">{user.tokens.toLocaleString()}</span>
                            <span className="text-[10px] font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-none p-6 space-y-4">
                 <h3 className="text-white font-black uppercase text-left text-sm tracking-widest">¿QUÉ SIGUE?</h3>
                 <p className="text-zinc-400 text-xs leading-relaxed font-medium text-left">
                    Tu reserva ha sido procesada con éxito. Podrás encontrar tu entrada y el código QR correspondiente en la sección de <span className="text-lime-400 font-black">Mis Reservas</span> dentro de tu perfil.
                 </p>
              </div>

              <div className="flex flex-col gap-3 p-6">
                 <Button 
                   onClick={() => router.push('/profile?tab=wallet&subtab=history')}
                   className="w-full py-6 bg-lime-400 text-[#07120b] hover:bg-lime-300 font-black uppercase tracking-widest rounded-none"
                 >
                    VER MI WALLET
                 </Button>
                 <Button 
                   onClick={() => router.push('/events')}
                   variant="ghost"
                   className="w-full py-6 text-zinc-400 hover:text-white font-black uppercase tracking-widest"
                 >
                    Volver a Eventos
                 </Button>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-8">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-rose-500 text-xs font-bold animate-in fade-in zoom-in w-full">
                  {error}
                </div>
              )}

              {/* Terminal-style checkout */}
              <div className="w-full space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                <div className="text-center space-y-2">
                   <h1 
                    style={{ fontFamily: 'var(--font-avigea)' }}
                    className="text-4xl text-white tracking-tight"
                   >
                     Confirmar <span className="text-[#A3E635]">Canje</span>
                   </h1>
                </div>

                <div className="w-full space-y-8 relative">
                  <div className="terminal-overlay absolute inset-0 bg-[#A3E635]/5 opacity-0 pointer-events-none" />
                  
                  {/* Event Summary */}
                  <div className="py-2 space-y-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Evento Seleccionado</p>
                      <div className="flex flex-col gap-6">
                        <div className="w-full aspect-square rounded-none overflow-hidden border border-white/5 shadow-2xl">
                          <img src={eventDetail.img || eventDetail.flyerUrl} alt={eventDetail.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-2">
                          <h2 
                            style={{ fontFamily: 'var(--font-avigea)' }}
                            className="text-4xl text-white tracking-tight leading-none"
                          >
                            {eventDetail.title}
                          </h2>
                          <p className="text-[#A3E635] text-xs font-black uppercase tracking-[0.2em]">{categoryName}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Token Status */}
                  <div className="py-6 space-y-10">
                    <div className="grid grid-cols-1 gap-8">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Costo del canje</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-white tracking-tighter">{price.toLocaleString()}</span>
                          <span className="text-xs font-black text-[#A3E635] uppercase">TOKENS</span>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="flex justify-between items-center opacity-60">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-zinc-700" /> Tu Saldo
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-white tracking-tighter">{user.tokens.toLocaleString()}</span>
                            <span className="text-[9px] font-black text-[#A3E635] uppercase">TOKENS</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-[#A3E635] uppercase tracking-widest flex items-center gap-2 italic">
                            <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" /> Tokens Restantes
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-white tracking-tighter">{(user.tokens - price).toLocaleString()}</span>
                            <span className="text-[10px] font-black text-[#A3E635] uppercase">TOKENS</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleConfirm}
                      disabled={isProcessing || user.tokens < price}
                      className="w-full py-8 bg-gradient-to-r from-[#A3E635] to-[#4ade80] text-[#07120b] hover:shadow-[0_0_50px_rgba(163,230,53,0.3)] transition-all duration-500 font-black uppercase tracking-[0.2em] rounded-none text-lg relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                      AUTORIZAR CANJE
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
