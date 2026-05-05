'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
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
        <div className="fixed top-4 right-4 bg-lime-400 text-[#07120b] px-5 py-3 rounded-xl shadow-lg z-50 text-sm font-semibold">
          {notification}
        </div>
      )}

      {/* Main card */}
      <div className="glass-surface rounded-2xl overflow-hidden">
        {/* Image */}
        <div className="h-64 bg-white/[0.02] flex items-center justify-center relative">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="w-20 h-20 text-zinc-600" />
          )}
          {/* Stock dot */}
          <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
            product.stock === 0 ? 'bg-red-500' : product.stock <= 3 ? 'bg-amber-500' : 'bg-lime-400'
          }`} />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <Badge variant="secondary">{product.category}</Badge>
              <h1 className="text-2xl font-bold text-zinc-100">{product.name}</h1>
              {product.sellerUsername && (
                <p className="text-sm text-zinc-500">
                  Vendido por{' '}
                  <span className="font-medium text-lime-400">{product.sellerUsername}</span>
                </p>
              )}
            </div>
            <WishlistButton productId={product.id} initialWishlisted={wishlisted} />
          </div>

          {product.description && (
            <p className="text-zinc-400 text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Cannabinoid profile */}
          {hasCannabinoids && (
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-semibold text-lime-400 uppercase tracking-wide">
                Perfil cannabinoide
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.thc != null && (
                  <span className="inline-flex items-center gap-1 bg-lime-400/10 text-lime-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-lime-400/20">
                    THC {product.thc}%
                  </span>
                )}
                {product.cbd != null && (
                  <span className="inline-flex items-center gap-1 bg-blue-400/10 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-400/20">
                    CBD {product.cbd}%
                  </span>
                )}
                {product.terpenes && (
                  <span className="inline-flex items-center gap-1 bg-purple-400/10 text-purple-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-400/20">
                    Terpenos: {product.terpenes}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price + actions */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
            <div className="flex flex-col">
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Precio por unidad</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tighter">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-sm font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
              </div>
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
                className="bg-lime-400 text-[#07120b] hover:bg-lime-300 font-semibold"
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
              ? 'text-red-400'
              : product.stock <= 3
              ? 'text-amber-400'
              : 'text-zinc-500'
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
