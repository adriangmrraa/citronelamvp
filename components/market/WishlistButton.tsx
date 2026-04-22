'use client';

import { useState } from 'react';

interface WishlistButtonProps {
  productId: number;
  initialWishlisted?: boolean;
}

export default function WishlistButton({ productId, initialWishlisted = false }: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    try {
      const method = wishlisted ? 'DELETE' : 'POST';
      const res = await fetch('/api/wishlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setWishlisted((prev) => !prev);
      }
    } catch {
      // silent — don't disrupt UX
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={wishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
        wishlisted
          ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-400'
      } disabled:opacity-50`}
    >
      <svg
        className="w-5 h-5"
        fill={wishlisted ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
