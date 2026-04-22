'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard, { type Product } from '@/components/market/ProductCard';
import FilterBar from '@/components/market/FilterBar';
import CartDrawer, { type CartItem } from '@/components/market/CartDrawer';
import ProductForm from '@/components/market/ProductForm';
import { Button } from '@/components/ui/button';

export default function MarketPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [category, setCategory] = useState('Todas');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');

  // Cart (client-side only)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Modals
  const [showProductForm, setShowProductForm] = useState(false);

  // Notification
  const [notification, setNotification] = useState<string | null>(null);

  function notify(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      setProducts(data.products ?? data ?? []);
    } catch {
      setError('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filtered + sorted products
  const filtered = useMemo(() => {
    let result = [...products];

    if (category !== 'Todas') {
      result = result.filter((p) => p.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.sellerUsername?.toLowerCase().includes(q)
      );
    }

    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    // newest: keep API order (default)

    return result;
  }, [products, category, sort, search]);

  // Cart operations
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
      prev.map((i) => {
        if (i.product.id !== productId) return i;
        if (qty > i.product.stock) {
          notify('Stock máximo alcanzado');
          return i;
        }
        return { ...i, quantity: qty };
      })
    );
  }

  async function handleConfirmCange() {
    if (cart.length === 0 || confirming) return;
    setConfirming(true);
    const errors: string[] = [];
    for (const item of cart) {
      try {
        const res = await fetch(`/api/products/${item.product.id}/purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: item.quantity }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          errors.push(`${item.product.name}: ${data.error ?? 'Error'}`);
        }
      } catch {
        errors.push(`${item.product.name}: error de conexión`);
      }
    }

    if (errors.length === 0) {
      setCart([]);
      setCartOpen(false);
      notify('¡Canges confirmados!');
      fetchProducts(); // refresh stock
    } else {
      notify(`Errores: ${errors.join(', ')}`);
    }
    setConfirming(false);
  }

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-[#16A34A] text-white px-5 py-3 rounded-xl shadow-lg z-50 text-sm font-medium">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mercado GTL</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {products.length} productos disponibles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowProductForm(true)} size="sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Publicar producto
          </Button>
          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl hover:border-[#16A34A] transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#16A34A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        category={category}
        sort={sort}
        search={search}
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onSearchChange={setSearch}
      />

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Products grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && !error && (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
            Sin productos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No se encontraron productos con esos filtros
          </p>
        </div>
      )}

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

      {/* Product form modal */}
      {showProductForm && (
        <ProductForm
          onSuccess={(newProduct) => {
            setProducts((prev) => [newProduct, ...prev]);
            setShowProductForm(false);
            notify('¡Producto publicado!');
          }}
          onCancel={() => setShowProductForm(false)}
        />
      )}
    </div>
  );
}
