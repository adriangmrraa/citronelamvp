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
      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        No hay categorías de entrada disponibles.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Ticket className="w-4 h-4 text-green-600 dark:text-green-400" />
          Seleccioná tu entrada
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <Coins className="w-4 h-4" />
          <span>Tu balance: <strong className="text-green-600 dark:text-green-400">{userTokens} tokens</strong></span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
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
                  ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700'
                  : isSelected
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
              }`}
            >
              <input
                type="radio"
                name="ticket-category"
                value={cat.id}
                checked={isSelected}
                onChange={() => !full && setSelected(cat.id)}
                disabled={full}
                className="mt-0.5 accent-green-600"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{cat.name}</span>
                  <span className={`font-bold text-sm ${affordable ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {cat.price === 0 ? 'Gratis' : `${cat.price} tokens`}
                  </span>
                </div>
                {cat.benefits && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cat.benefits}</p>
                )}
                <div className="flex items-center gap-3 mt-1">
                  {cat.capacity !== null && (
                    <span className="text-xs text-gray-400">
                      {cat.capacity - cat.reserved} lugar{cat.capacity - cat.reserved !== 1 ? 'es' : ''} disponible{cat.capacity - cat.reserved !== 1 ? 's' : ''}
                    </span>
                  )}
                  {full && (
                    <span className="text-xs font-medium text-red-500 dark:text-red-400">Agotado</span>
                  )}
                  {!affordable && !full && cat.price > 0 && (
                    <span className="text-xs text-red-400">Tokens insuficientes</span>
                  )}
                </div>
              </div>
              {isSelected && !full && <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />}
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
