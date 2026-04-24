'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

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
          ? 'bg-red-500/20 text-red-400'
          : 'bg-white/[0.06] text-zinc-500 hover:bg-red-500/20 hover:text-red-400'
      } disabled:opacity-50`}
    >
      <Heart
        className="w-5 h-5"
        fill={wishlisted ? 'currentColor' : 'none'}
      />
    </button>
  );
}
