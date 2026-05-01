'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/types/market';

const CATEGORIES = ['Sustratos', 'Nutrientes', 'Semillas', 'Equipamiento', 'Kits', 'Parafernalia', 'Bienestar', 'Accesorios'];

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="bg-[#07120b] border border-[#a3e635]/30 rounded-[2.5rem] shadow-glow-lime/10 w-full max-w-lg overflow-y-auto max-h-[90vh] relative">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.05] relative z-10">
          <h2 
            style={{ fontFamily: 'var(--font-avigea)' }}
            className="text-2xl tracking-tight text-white"
          >
            {isEditing ? 'Editar' : 'Publicar'} <span className="text-primary">Producto</span>
          </h2>
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5 relative z-10">
          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-3 rounded-2xl text-sm animate-in shake duration-300">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">
              Nombre del Producto <span className="text-primary">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ej: Gorilla Glue Auto #4"
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">
              Descripción Detallada
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describí las características, efectos o especificaciones..."
              rows={3}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">
              Categoría <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#07120b] text-white">
                    {cat}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                expand_more
              </span>
            </div>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">
                Precio (TOKENS) <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0"
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">
                Stock Inicial <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
                placeholder="0"
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">
              URL de la Imagen
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors">
                image
              </span>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => set('imageUrl', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
              />
            </div>
            <p className="text-[9px] text-zinc-500 ml-1">Tip: Usá imágenes de Unsplash o links directos .jpg/.png</p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-4 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-bold text-xs uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] px-6 py-4 rounded-2xl bg-primary text-black hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-xs uppercase tracking-widest shadow-glow-lime/20 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? 'Procesando...' : isEditing ? 'Guardar Cambios' : 'Publicar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
