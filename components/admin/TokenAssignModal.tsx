'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface TokenAssignModalProps {
  userId: number;
  username: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TokenAssignModal({ userId, username, onClose, onSuccess }: TokenAssignModalProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsed = parseInt(amount, 10);
    if (isNaN(parsed) || parsed === 0) {
      setError('Ingresá un número válido (puede ser negativo para restar)');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${userId}/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parsed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al asignar tokens');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#07120b] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-zinc-50 mb-1">
          Asignar tokens
        </h2>
        <p className="text-sm text-zinc-500 mb-5">
          Usuario: <span className="font-medium text-zinc-300">{username}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">
              Cantidad de tokens
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ej: 10 (o -5 para restar)"
              required
              autoFocus
            />
            <p className="text-xs text-zinc-500">
              Usá un número negativo para quitar tokens.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Asignar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
