'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface Product {
  id: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
  sellerUsername?: string;
  sellerId?: number;
  thc?: number | null;
  cbd?: number | null;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const router = useRouter();

  const hasCannabinoids = product.thc != null || product.cbd != null;
  const inStock = product.stock > 0;

  return (
    <Card className="overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div
        onClick={() => router.push(`/market/products/${product.id}`)}
        className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center group-hover:from-green-50 group-hover:to-green-100/50 dark:group-hover:from-green-900/20 dark:group-hover:to-green-900/10 transition-all duration-300 relative"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
            <span className="text-3xl">📦</span>
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
            <Badge variant="outline" className="text-xs text-green-700 border-green-300 dark:text-green-400 dark:border-green-800">
              THC {product.thc}%
            </Badge>
          )}
          {hasCannabinoids && product.cbd != null && (
            <Badge variant="outline" className="text-xs text-blue-700 border-blue-300 dark:text-blue-400 dark:border-blue-800">
              CBD {product.cbd}%
            </Badge>
          )}
        </div>

        {/* Name */}
        <div
          onClick={() => router.push(`/market/products/${product.id}`)}
          className="space-y-0.5"
        >
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
          {product.sellerUsername && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              por {product.sellerUsername}
            </p>
          )}
        </div>

        {/* Price + action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Precio</p>
            <span className="text-lg font-bold" style={{ color: '#D97706' }}>
              🪙 {product.price.toLocaleString('es-AR')}
            </span>
          </div>
          {inStock ? (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="text-xs"
            >
              Agregar al carrito
            </Button>
          ) : (
            <Button size="sm" disabled variant="secondary" className="text-xs">
              Sin stock
            </Button>
          )}
        </div>

        {/* Stock text */}
        <p className={`text-xs ${
          product.stock === 0
            ? 'text-red-500 dark:text-red-400'
            : product.stock <= 3
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-gray-400 dark:text-gray-500'
        }`}>
          {product.stock === 0
            ? 'Sin stock'
            : product.stock <= 3
            ? `¡Solo quedan ${product.stock}!`
            : `${product.stock} disponibles`}
        </p>
      </CardContent>
    </Card>
  );
}
