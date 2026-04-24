'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Ticket, Coins, CheckCircle2 } from 'lucide-react';

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
  categories: TicketCategory[];
  userTokens: number;
  onSuccess: () => void;
}

export default function TicketSelector({ eventId, categories, userTokens, onSuccess }: TicketSelectorProps) {
  const [selected, setSelected] = useState<number | null>(categories[0]?.id ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedCat = categories.find((c) => c.id === selected);
  const canAfford = selectedCat !== undefined && userTokens >= selectedCat.price;
  const isFull = (cat: TicketCategory) =>
    cat.capacity !== null && cat.reserved >= cat.capacity;

  const handleReserve = async () => {
    if (!selected) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/events/${eventId}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: selected }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al reservar');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="p-4 text-center text-zinc-500 text-sm">
        No hay categorías de entrada disponibles.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
          <Ticket className="w-4 h-4 text-lime-400" />
          Seleccioná tu entrada
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <Coins className="w-4 h-4" />
          <span>Tu balance: <strong className="text-lime-400">{userTokens} tokens</strong></span>
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
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                full
                  ? 'opacity-50 cursor-not-allowed border-white/[0.06]'
                  : isSelected
                  ? 'border-lime-400/50 bg-lime-400/5'
                  : 'border-white/[0.08] hover:border-lime-400/30'
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
                  <span className={`font-bold text-sm ${affordable ? 'text-lime-400' : 'text-red-400'}`}>
                    {cat.price === 0 ? 'Gratis' : `${cat.price} tokens`}
                  </span>
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
        className="w-full"
        onClick={handleReserve}
        disabled={loading || !selected || !canAfford || (selectedCat ? isFull(selectedCat) : false)}
      >
        {loading ? 'Reservando...' : canAfford ? 'Confirmar reserva' : 'Tokens insuficientes'}
      </Button>
    </div>
  );
}
