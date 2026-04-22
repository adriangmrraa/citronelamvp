'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import WishlistButton from './WishlistButton';
import SellerReputation from './SellerReputation';
import type { Product } from './ProductCard';

export interface SellerInfo {
  id: number;
  username: string;
  averageRating: number;
  reviewCount: number;
  totalSales: number;
}

interface ProductDetailProps {
  product: Product & {
    terpenes?: string | null;
  };
  seller?: SellerInfo;
  onAddToCart: (product: Product) => void;
  wishlisted?: boolean;
}

export default function ProductDetail({
  product,
  seller,
  onAddToCart,
  wishlisted = false,
}: ProductDetailProps) {
  const [purchasing, setPurchasing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const inStock = product.stock > 0;
  const hasCannabinoids = product.thc != null || product.cbd != null || product.terpenes;

  function notify(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }

  async function handlePurchase() {
    if (!inStock || purchasing) return;
    setPurchasing(true);
    try {
      const res = await fetch(`/api/products/${product.id}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: 1 }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        notify(data.error ?? 'Error al procesar la compra');
      } else {
        notify('¡Cange confirmado!');
      }
    } catch {
      notify('Error de conexión');
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-[#16A34A] text-white px-5 py-3 rounded-xl shadow-lg z-50 text-sm font-medium">
          {notification}
        </div>
      )}

      {/* Main card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Image */}
        <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center relative">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-8xl">📦</span>
          )}
          {/* Stock dot */}
          <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
            product.stock === 0 ? 'bg-red-500' : product.stock <= 3 ? 'bg-amber-500' : 'bg-green-500'
          }`} />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <Badge variant="secondary">{product.category}</Badge>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
              {product.sellerUsername && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vendido por{' '}
                  <span className="font-medium text-[#16A34A]">{product.sellerUsername}</span>
                </p>
              )}
            </div>
            <WishlistButton productId={product.id} initialWishlisted={wishlisted} />
          </div>

          {product.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Cannabinoid profile */}
          {hasCannabinoids && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-semibold text-green-800 dark:text-green-400 uppercase tracking-wide">
                Perfil cannabinoide
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.thc != null && (
                  <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                    THC {product.thc}%
                  </span>
                )}
                {product.cbd != null && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                    CBD {product.cbd}%
                  </span>
                )}
                {product.terpenes && (
                  <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Terpenos: {product.terpenes}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price + actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Precio por unidad</p>
              <span className="text-3xl font-bold" style={{ color: '#D97706' }}>
                🪙 {product.price.toLocaleString('es-AR')}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onAddToCart(product)}
                disabled={!inStock}
                size="sm"
              >
                + Carrito
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={!inStock || purchasing}
              >
                {purchasing ? 'Procesando...' : inStock ? 'Comprar ahora' : 'Sin stock'}
              </Button>
            </div>
          </div>

          {/* Stock */}
          <p className={`text-xs ${
            product.stock === 0
              ? 'text-red-500 dark:text-red-400'
              : product.stock <= 3
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}>
            {product.stock === 0
              ? 'Sin stock disponible'
              : product.stock <= 3
              ? `¡Solo quedan ${product.stock} unidades!`
              : `${product.stock} unidades disponibles`}
          </p>
        </div>
      </div>

      {/* Seller reputation */}
      {seller && (
        <SellerReputation
          averageRating={seller.averageRating}
          reviewCount={seller.reviewCount}
          totalSales={seller.totalSales}
        />
      )}
    </div>
  );
}
