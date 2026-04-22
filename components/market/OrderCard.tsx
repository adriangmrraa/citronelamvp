'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ReviewForm from './ReviewForm';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  pricePerUnit: number;
}

export interface Order {
  id: number;
  createdAt: string;
  totalTokens: number;
  status: 'Pendiente' | 'Entregado' | 'Cancelado';
  items: OrderItem[];
  hasReview?: boolean;
}

interface OrderCardProps {
  order: Order;
  onReviewSubmitted?: (orderId: number) => void;
}

const STATUS_BADGE: Record<Order['status'], 'warning' | 'success' | 'destructive'> = {
  Pendiente: 'warning',
  Entregado: 'success',
  Cancelado: 'destructive',
};

export default function OrderCard({ order, onReviewSubmitted }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const formattedDate = new Date(order.createdAt).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  function handleReviewSuccess() {
    setShowReview(false);
    onReviewSubmitted?.(order.id);
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Header row */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Cange #{order.id}
              </span>
              <Badge variant={STATUS_BADGE[order.status]}>{order.status}</Badge>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">{formattedDate}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Total</p>
            <span className="text-base font-bold" style={{ color: '#D97706' }}>
              🪙 {order.totalTokens.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Expand toggle */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-2 flex items-center justify-between">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#16A34A] transition-colors"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {expanded ? 'Ocultar items' : `Ver ${order.items.length} ${order.items.length === 1 ? 'item' : 'items'}`}
          </button>

          {order.status === 'Entregado' && !order.hasReview && (
            <Button size="sm" variant="outline" onClick={() => setShowReview(true)} className="text-xs h-7">
              Dejar reseña
            </Button>
          )}
        </div>

        {/* Items list */}
        {expanded && (
          <div className="px-5 pb-4 space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.productName}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {item.quantity} × 🪙 {item.pricePerUnit.toLocaleString('es-AR')}
                  </p>
                </div>
                <span className="text-sm font-semibold" style={{ color: '#D97706' }}>
                  🪙 {(item.quantity * item.pricePerUnit).toLocaleString('es-AR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showReview && (
        <ReviewForm
          orderId={order.id}
          onSuccess={handleReviewSuccess}
          onCancel={() => setShowReview(false)}
        />
      )}
    </>
  );
}
