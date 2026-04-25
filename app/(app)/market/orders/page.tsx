'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import OrderCard, { type Order } from '@/components/market/OrderCard';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Error al cargar canges');
      const data = await res.json();
      setOrders(data.orders ?? data ?? []);
    } catch {
      setError('No se pudieron cargar los canges');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function handleReviewSubmitted(orderId: number) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, hasReview: true } : o))
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Mis Canges</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Historial de tus canjes en el mercado
          </p>
        </div>
        <button
          onClick={() => router.push('/market')}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-lime-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Mercado
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white/[0.04] rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && orders.length === 0 && !error && (
        <div className="text-center py-20 bg-white/[0.03] rounded-2xl border border-white/[0.08]">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-white/[0.10]" />
          <h2 className="text-lg font-bold text-zinc-200 mb-2">
            No tenés canges todavía
          </h2>
          <p className="text-sm text-zinc-500 mb-6">
            Explorá el mercado y realizá tu primer canje
          </p>
          <button
            onClick={() => router.push('/market')}
            className="bg-lime-400 text-[#07120b] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-lime-300 transition-colors"
          >
            Ir al mercado
          </button>
        </div>
      )}

      {/* Orders list */}
      {!loading && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onReviewSubmitted={handleReviewSubmitted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
