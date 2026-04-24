'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Product } from './ProductCard';

const CATEGORIES = ['Flores', 'Parafernalia', 'Genéticas'];

interface ProductFormProps {
  product?: Partial<Product>;
  onSuccess: (product: Product) => void;
  onCancel: () => void;
}

interface FormState {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  imageUrl: string;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const isEditing = Boolean(product?.id);

  const [form, setForm] = useState<FormState>({
    name: product?.name ?? '',
    description: product?.description ?? '',
    category: product?.category ?? 'Flores',
    price: product?.price?.toString() ?? '',
    stock: product?.stock?.toString() ?? '',
    imageUrl: product?.imageUrl ?? '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setError('El precio debe ser un número positivo');
      return;
    }
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      setError('El stock debe ser un número válido');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl: form.imageUrl.trim() || undefined,
      };

      const url = isEditing ? `/api/products/${product!.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error al guardar el producto');
      }

      const data = await res.json();
      onSuccess(data.product ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#07120b] border border-white/[0.08] rounded-2xl shadow-xl w-full max-w-md overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <h2 className="font-bold text-zinc-50 text-lg">
            {isEditing ? 'Editar producto' : 'Publicar producto'}
          </h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-zinc-400 hover:bg-white/[0.10] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-medium text-sm">
              Nombre <span className="text-red-400">*</span>
            </label>
            <Input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Gorilla Glue fem"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-medium text-sm">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describí tu producto..."
              rows={3}
              className="flex w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-medium text-sm">
              Categoría <span className="text-red-400">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="flex h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#07120b] text-zinc-300">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium text-sm">
                Precio (tokens) <span className="text-red-400">*</span>
              </label>
              <Input
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="5000"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium text-sm">
                Stock <span className="text-red-400">*</span>
              </label>
              <Input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
                placeholder="10"
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-medium text-sm">
              URL de imagen
            </label>
            <Input
              type="url"
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.10] text-zinc-300 hover:bg-white/[0.10] transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-lime-400 text-[#07120b] hover:bg-lime-300 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Publicar producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
