'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Ticket, Coins, CheckCircle2 } from 'lucide-react';

import { useUser } from '@/hooks/useUser';

interface TicketCategory {
  id: number;
  name: string;
  price: number;
  benefits: string | null;
  capacity: number | null;
  reserved: number;
}

interface TicketSelectorProps {
  eventId: number;
  eventTitle: string;
  categories: TicketCategory[];
  onSuccess: () => void;
}

export default function TicketSelector({ eventId, eventTitle, categories, onSuccess }: TicketSelectorProps) {
  const router = useRouter();
  const { user, spendTokens, addReservation } = useUser();
  const userTokens = user.tokens;
  const [selected, setSelected] = useState<number | null>(categories[0]?.id ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedCat = categories.find((c) => c.id === selected);
  const canAfford = selectedCat !== undefined && userTokens >= selectedCat.price;
  const isFull = (cat: TicketCategory) =>
    cat.capacity !== null && cat.reserved >= cat.capacity;

  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmRedirect = () => {
    if (!selectedCat) return;
    router.push(`/events/checkout/${eventId}?cat=${selectedCat.id}`);
  };

  if (categories.length === 0) {
    return (
      <div className="p-4 text-center text-zinc-500 text-sm">
        No hay categorías de entrada disponibles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Ticket className="w-4 h-4 text-lime-400" />
          Seleccioná tu entrada
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-zinc-400 pr-2">
          <div className="flex items-baseline gap-1">
            <span className="text-zinc-500 text-[10px] uppercase font-black mr-1 italic">Saldo:</span>
            <span className="text-xl font-black text-white tracking-tighter">{userTokens.toLocaleString()}</span>
            <span className="text-[10px] font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {categories.map((cat) => {
          const full = isFull(cat);
          const affordable = userTokens >= cat.price;
          const isSelected = selected === cat.id;

          return (
            <label
              key={cat.id}
              className={`flex items-start gap-3 p-4 border-b cursor-pointer transition-all ${
                full
                  ? 'opacity-50 cursor-not-allowed border-white/5'
                  : isSelected
                  ? 'border-[#A3E635]/30 bg-[#A3E635]/5'
                  : 'border-white/5 hover:border-[#A3E635]/20 hover:bg-white/[0.02]'
              }`}
            >
              <input
                type="radio"
                name="ticket-category"
                value={cat.id}
                checked={isSelected}
                onChange={() => !full && setSelected(cat.id)}
                disabled={full}
                className="mt-0.5 accent-lime-400"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-zinc-100">{cat.name}</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-lg font-black tracking-tighter ${affordable ? 'text-white' : 'text-red-500'}`}>
                      {cat.price === 0 ? 'Gratis' : cat.price.toLocaleString()}
                    </span>
                    {cat.price > 0 && (
                      <span className={`text-[10px] font-black uppercase tracking-tight ${affordable ? 'text-[#A3E635]' : 'text-red-500/80'}`}>TOKENS</span>
                    )}
                  </div>
                </div>
                {cat.benefits && (
                  <p className="text-xs text-zinc-500 mt-0.5">{cat.benefits}</p>
                )}
                <div className="flex items-center gap-3 mt-1">
                  {cat.capacity !== null && (
                    <span className="text-xs text-zinc-500">
                      {cat.capacity - cat.reserved} lugar{cat.capacity - cat.reserved !== 1 ? 'es' : ''} disponible{cat.capacity - cat.reserved !== 1 ? 's' : ''}
                    </span>
                  )}
                  {full && (
                    <span className="text-xs font-medium text-red-400">Agotado</span>
                  )}
                  {!affordable && !full && cat.price > 0 && (
                    <span className="text-xs text-red-400">Tokens insuficientes</span>
                  )}
                </div>
              </div>
              {isSelected && !full && <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />}
            </label>
          );
        })}
      </div>

      <Button
        className="w-full bg-[#A3E635] text-[#07120b] hover:bg-[#b4f346] font-black uppercase tracking-widest py-6 rounded-none mt-4"
        onClick={() => setShowConfirm(true)}
        disabled={loading || !selected || !canAfford || (selectedCat ? isFull(selectedCat) : false)}
      >
        {canAfford ? 'Confirmar reserva' : 'Tokens insuficientes'}
      </Button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative w-full max-w-sm bg-[#07120b] border border-white/10 p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-[#A3E635]/10 rounded-full flex items-center justify-center mx-auto">
                <Ticket className="w-8 h-8 text-[#A3E635]" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">¿Estás seguro?</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Vas a adquirir <span className="text-white font-bold">1 entrada</span> para <span className="text-[#A3E635] font-bold">{eventTitle}</span> por <span className="text-white font-bold">{selectedCat?.price} tokens</span>.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleConfirmRedirect}
                className="w-full bg-[#A3E635] text-[#07120b] hover:bg-lime-300 font-black uppercase tracking-widest py-6 rounded-none"
              >
                SÍ, CONFIRMAR
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setShowConfirm(false)}
                className="w-full text-zinc-500 hover:text-white font-black uppercase tracking-widest py-6"
              >
                CANCELAR
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
