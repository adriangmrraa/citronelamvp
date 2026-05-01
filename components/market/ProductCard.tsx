'use client';

import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/market';

export type { Product };

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const router = useRouter();

  const hasCannabinoids = product.thc != null || product.cbd != null;
  const inStock = product.stock > 0;

  return (
    <Card className="group rounded-2xl glass-surface transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/[0.20] hover:shadow-lg hover:shadow-lime-400/[0.05] overflow-hidden">
      {/* Image */}
      <div
        onClick={() => router.push(`/market/products/${product.id}`)}
        className="h-40 overflow-hidden relative cursor-pointer"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center group-hover:scale-105 group-hover:brightness-110 transition-transform duration-500">
            <Package className="w-10 h-10 text-zinc-600" />
          </div>
        )}
        {/* Stock indicator */}
        <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${
          product.stock === 0
            ? 'bg-red-500'
            : product.stock <= 3
            ? 'bg-amber-500'
            : 'bg-green-500'
        }`} title={`Stock: ${product.stock}`} />
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Category + cannabinoids */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-xs">{product.category}</Badge>
          {hasCannabinoids && product.thc != null && (
            <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">
              THC {product.thc}%
            </Badge>
          )}
          {hasCannabinoids && product.cbd != null && (
            <Badge variant="outline" className="text-xs text-blue-400 border-blue-500/30">
              CBD {product.cbd}%
            </Badge>
          )}
        </div>

        {/* Name */}
        <div
          onClick={() => router.push(`/market/products/${product.id}`)}
          className="space-y-0.5 cursor-pointer"
        >
          <h3 className="font-bold text-zinc-50 text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
          {product.sellerUsername && (
            <p className="text-xs text-zinc-400">
              por {product.sellerUsername}
            </p>
          )}
        </div>

        {/* Price + action */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <div>
            <p className="text-xs text-zinc-500">Precio</p>
            <span className="text-lg font-bold text-lime-400">
              ${product.price.toLocaleString('es-AR')}
            </span>
          </div>
          {inStock ? (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="text-xs bg-lime-400 text-[#07120b] hover:bg-lime-300 font-semibold rounded-xl"
            >
              Agregar al carrito
            </Button>
          ) : (
            <Button size="sm" disabled variant="secondary" className="text-xs rounded-xl">
              Sin stock
            </Button>
          )}
        </div>

        {/* Stock text */}
        <p className={`text-xs ${
          product.stock === 0
            ? 'text-red-500'
            : product.stock <= 3
            ? 'text-amber-500'
            : 'text-zinc-500'
        }`}>
          {product.stock === 0
            ? 'Sin stock'
            : product.stock <= 3
            ? `Solo quedan ${product.stock}`
            : `${product.stock} disponibles`}
        </p>
      </CardContent>
    </Card>
  );
}
