'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductDetail from '@/components/market/ProductDetail';
import CartDrawer, { type CartItem } from '@/components/market/CartDrawer';
import type { Product } from '@/components/market/ProductCard';
import type { SellerInfo } from '@/components/market/ProductDetail';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<(Product & { terpenes?: string | null }) | null>(null);
  const [seller, setSeller] = useState<SellerInfo | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cart (passed down from this page — page-level state per spec)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  function notify(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (res.status === 404) {
        setError('Producto no encontrado');
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      const p: Product & { terpenes?: string | null } = data.product ?? data;
      setProduct(p);

      // Fetch seller reputation if we have a sellerId
      if (p.sellerId) {
        try {
          const sellerRes = await fetch(`/api/sellers/${p.sellerId}/reputation`);
          if (sellerRes.ok) {
            const sellerData = await sellerRes.json();
            setSeller(sellerData.seller ?? sellerData);
          }
        } catch {
          // non-critical
        }
      }
    } catch {
      setError('No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  function addToCart(p: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === p.id);
      if (existing) {
        if (existing.quantity >= p.stock) {
          notify('Stock máximo alcanzado');
          return prev;
        }
        return prev.map((i) =>
          i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product: p, quantity: 1 }];
    });
    notify(`${p.name} agregado al carrito`);
    setCartOpen(true);
  }

  function removeFromCart(productId: number) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function updateQty(productId: number, qty: number) {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  }

  async function handleConfirmCange() {
    if (cart.length === 0 || confirming) return;
    setConfirming(true);
    for (const item of cart) {
      try {
        await fetch(`/api/products/${item.product.id}/purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: item.quantity }),
        });
      } catch {
        // continue
      }
    }
    setCart([]);
    setCartOpen(false);
    notify('¡Canges confirmados!');
    setConfirming(false);
  }

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32" />
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center py-20">
        <p className="text-red-500 dark:text-red-400 mb-4">{error ?? 'Producto no encontrado'}</p>
        <button
          onClick={() => router.push('/market')}
          className="text-[#16A34A] hover:underline text-sm"
        >
          Volver al mercado
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-[#16A34A] text-white px-5 py-3 rounded-xl shadow-lg z-50 text-sm font-medium">
          {notification}
        </div>
      )}

      {/* Back + cart */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/market')}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#16A34A] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Mercado
        </button>

        {/* Cart icon */}
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl hover:border-[#16A34A] transition-colors shadow-sm text-sm"
        >
          <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">Carrito</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#16A34A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Detail */}
      <ProductDetail
        product={product}
        seller={seller}
        onAddToCart={addToCart}
      />

      {/* Cart drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onQtyChange={updateQty}
        onConfirm={handleConfirmCange}
        confirming={confirming}
      />
    </div>
  );
}
