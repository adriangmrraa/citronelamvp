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

const STATUS_CLASSES: Record<Order['status'], string> = {
  Entregado: 'bg-lime-400/10 text-lime-400 border border-lime-400/20',
  Pendiente: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  Cancelado: 'bg-red-500/10 text-red-400 border border-red-500/20',
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
      <div className="glass-surface rounded-2xl overflow-hidden">
        {/* Header row */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-200">
                Cange #{order.id}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_CLASSES[order.status]}`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-zinc-500">{formattedDate}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 mb-0.5">Total</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white tracking-tighter">
                {order.totalTokens.toLocaleString()}
              </span>
              <span className="text-xs font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
            </div>
          </div>
        </div>

        {/* Expand toggle */}
        <div className="border-t border-white/[0.06] px-5 py-2 flex items-center justify-between">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-lime-400 transition-colors"
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
                className="flex items-center justify-between glass-surface rounded-xl px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-200">{item.productName}</p>
                  <p className="text-xs text-zinc-500">
                    {item.quantity} × <span className="font-bold text-white/80 tracking-tighter">{item.pricePerUnit.toLocaleString()}</span>
                    <span className="ml-1 text-[8px] font-black text-[#A3E635] uppercase">TOKENS</span>
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-white tracking-tighter">
                    {(item.quantity * item.pricePerUnit).toLocaleString()}
                  </span>
                  <span className="text-[10px] font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
                </div>
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
