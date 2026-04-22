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
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
          Asignar tokens
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Usuario: <span className="font-medium text-gray-700 dark:text-gray-300">{username}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
            <p className="text-xs text-gray-400 dark:text-gray-500">
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
