'use client';

import { ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/market';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (productId: number) => void;
  onQtyChange: (productId: number, qty: number) => void;
  onConfirm: () => void;
  tokenBalance?: number;
  confirming?: boolean;
}

export default function CartDrawer({
  open,
  onClose,
  items,
  onRemove,
  onQtyChange,
  onConfirm,
  tokenBalance,
  confirming = false,
}: CartDrawerProps) {
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:max-w-sm bg-[#07120b] border-l border-white/[0.08] shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A3E635] flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.2)]">
              <ShoppingCart className="w-5 h-5 text-[#07120b] stroke-[1.5]" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-100 text-lg">Carrito</h2>
              {tokenBalance != null && (
                <p className="text-xs text-zinc-500 mt-0.5">
                  Saldo:{' '}
                  <span className="font-semibold text-[#A3E635]">
                    {tokenBalance.toLocaleString('es-AR')} tokens
                  </span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:bg-white/[0.08] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-24 px-8 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-zinc-900/50 flex items-center justify-center border border-white/5">
                <ShoppingCart className="w-10 h-10 text-zinc-700 stroke-[1]" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-bold tracking-tight">Tu carrito está vacío</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Parece que aún no has agregado nada. ¡Explorá el market y encontrá lo que buscás!
                </p>
              </div>
              <Button 
                onClick={onClose}
                variant="outline" 
                className="h-9 border-white/10 text-xs font-bold text-[#A3E635] hover:bg-[#A3E635]/5 rounded-xl"
              >
                VOLVER AL MARKET
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="glass-surface rounded-xl flex items-center gap-3 p-3"
              >
                <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-white/[0.08] flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <Package className="w-6 h-6 text-zinc-500" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-100 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-[#A3E635] font-bold">
                    {(item.product.price * item.quantity).toLocaleString('es-AR')} tokens
                  </p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onQtyChange(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:border-red-500/50 hover:text-red-400 transition-colors text-sm font-bold"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-zinc-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onQtyChange(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:border-lime-400/50 hover:text-lime-400 transition-colors text-sm font-bold disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemove(item.product.id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors ml-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-white/[0.08] space-y-3">
            <div className="glass-surface-2 rounded-xl px-4 py-3 flex items-center justify-between border border-white/5">
              <span className="text-sm text-zinc-400 font-medium">Total del canje</span>
              <span className="text-xl font-bold text-[#A3E635]">
                {total.toLocaleString('es-AR')} tokens
              </span>
            </div>
            <Button
              className="w-full h-12 bg-[#A3E635] text-[#07120b] hover:bg-[#b4f346] font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.1)]"
              onClick={onConfirm}
              disabled={confirming}
            >
              {confirming ? 'PROCESANDO...' : 'CONFIRMAR CANJE'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
