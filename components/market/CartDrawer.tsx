'use client';

import { Button } from '@/components/ui/button';
import type { Product } from './ProductCard';

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
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Carrito</h2>
            {tokenBalance != null && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Saldo:{' '}
                <span style={{ color: '#D97706' }} className="font-semibold">
                  🪙 {tokenBalance.toLocaleString('es-AR')}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
              <div className="text-4xl mb-3">🛒</div>
              <p className="text-sm">El carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3"
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs" style={{ color: '#D97706' }}>
                    🪙 {(item.product.price * item.quantity).toLocaleString('es-AR')}
                  </p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onQtyChange(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors text-sm font-bold"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onQtyChange(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors text-sm font-bold disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemove(item.product.id)}
                  className="text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors ml-1"
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
          <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total</span>
              <span className="text-xl font-bold" style={{ color: '#D97706' }}>
                🪙 {total.toLocaleString('es-AR')}
              </span>
            </div>
            <Button
              className="w-full"
              onClick={onConfirm}
              disabled={confirming}
            >
              {confirming ? 'Procesando...' : 'Confirmar Cange'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
