'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mis Canges</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Historial de tus canjes en el mercado
          </p>
        </div>
        <button
          onClick={() => router.push('/market')}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#16A34A] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Mercado
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && orders.length === 0 && !error && (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
            No tenés canges todavía
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Explorá el mercado y realizá tu primer canje
          </p>
          <button
            onClick={() => router.push('/market')}
            className="bg-[#16A34A] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#14532D] transition-colors"
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
