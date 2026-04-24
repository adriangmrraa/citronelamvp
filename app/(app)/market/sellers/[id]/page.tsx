'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Leaf } from 'lucide-react';
import ProductCard, { type Product } from '@/components/market/ProductCard';
import SellerReputation from '@/components/market/SellerReputation';
import CartDrawer, { type CartItem } from '@/components/market/CartDrawer';

interface SellerProfile {
  id: number;
  username: string;
  averageRating: number;
  reviewCount: number;
  totalSales: number;
}

export default function SellerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const sellerId = params.id as string;

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  function notify(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }

  const fetchSeller = useCallback(async () => {
    try {
      const [repRes, prodRes] = await Promise.all([
        fetch(`/api/sellers/${sellerId}/reputation`),
        fetch(`/api/products?sellerId=${sellerId}`),
      ]);

      if (!repRes.ok) throw new Error('Vendedor no encontrado');
      const repData = await repRes.json();
      setSeller(repData.seller ?? repData);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products ?? prodData ?? []);
      }
    } catch {
      setError('No se pudo cargar el perfil del vendedor');
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchSeller();
  }, [fetchSeller]);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          notify('Stock máximo alcanzado');
          return prev;
        }
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    notify(`${product.name} agregado al carrito`);
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
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/[0.04] rounded w-48" />
          <div className="h-28 bg-white/[0.04] rounded-2xl" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-56 bg-white/[0.04] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center py-20">
        <p className="text-red-400 mb-4">{error ?? 'Vendedor no encontrado'}</p>
        <button
          onClick={() => router.push('/market')}
          className="text-lime-400 hover:underline text-sm"
        >
          Volver al mercado
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-lime-400 text-[#07120b] px-5 py-3 rounded-xl shadow-lg z-50 text-sm font-medium">
          {notification}
        </div>
      )}

      {/* Back + cart */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/market')}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-lime-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Mercado
        </button>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-3 py-2 rounded-xl hover:border-lime-400/40 transition-colors text-sm"
        >
          <ShoppingCart className="w-4 h-4 text-zinc-400" />
          <span className="text-zinc-300">Carrito</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-lime-400 text-[#07120b] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Seller header */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-lime-400/10 flex items-center justify-center">
            <Leaf className="w-8 h-8 text-lime-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-50">
              {seller.username}
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              {products.length} {products.length === 1 ? 'producto' : 'productos'} publicados
            </p>
          </div>
        </div>
      </div>

      {/* Reputation */}
      <SellerReputation
        averageRating={seller.averageRating}
        reviewCount={seller.reviewCount}
        totalSales={seller.totalSales}
      />

      {/* Products */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Productos de {seller.username}
        </h2>
        {products.length === 0 ? (
          <div className="text-center py-12 bg-white/[0.03] rounded-2xl border border-white/[0.08]">
            <p className="text-zinc-500 text-sm">
              Este vendedor no tiene productos disponibles
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>

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
