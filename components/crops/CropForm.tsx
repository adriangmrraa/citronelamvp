'use client';

import { useState } from 'react';
import type { Crop } from '@/db/schema';

const CULTIVATION_METHODS = [
  { value: 'Organico', label: 'Orgánico' },
  { value: 'Hidroponia', label: 'Hidroponia' },
  { value: 'SalesMinerales', label: 'Sales Minerales' },
  { value: 'Mixto', label: 'Mixto' },
] as const;

interface CropFormProps {
  crop?: Crop;
  onSuccess: (crop: Crop) => void;
  onCancel: () => void;
}

export default function CropForm({ crop, onSuccess, onCancel }: CropFormProps) {
  const isEdit = !!crop;

  const [bucketName, setBucketName] = useState(crop?.bucketName ?? '');
  const [cultivationMethod, setCultivationMethod] = useState(crop?.cultivationMethod ?? 'Organico');
  const [imageUrl, setImageUrl] = useState(crop?.imageUrl ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!bucketName.trim()) {
      setError('Nombre de parcela requerido');
      return;
    }
    if (bucketName.length > 100) {
      setError('Nombre demasiado largo (máx 100 caracteres)');
      return;
    }

    setLoading(true);
    try {
      const url = isEdit ? `/api/crops/${crop!.id}` : '/api/crops';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bucketName: bucketName.trim(),
          cultivationMethod,
          imageUrl: imageUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Error al guardar');
        return;
      }

      onSuccess(data.crop);
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#07120b] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-white/[0.08]">
          <h2 className="text-xl font-bold text-zinc-50">
            {isEdit ? 'Editar Parcela' : 'Nueva Parcela'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">
              {error}
            </p>
          )}

          <div>
            <label className="block text-zinc-300 font-medium text-sm mb-1.5">
              Nombre de la parcela
            </label>
            <input
              type="text"
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
              placeholder="ej: Gorilla Glue #4"
              maxLength={100}
              className="w-full border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm bg-white/[0.04] text-zinc-50 placeholder:text-zinc-500 focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium text-sm mb-1.5">
              Método de cultivo
            </label>
            <select
              value={cultivationMethod}
              onChange={(e) => setCultivationMethod(e.target.value as typeof cultivationMethod)}
              className="w-full border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm bg-white/[0.04] text-zinc-300 focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 outline-none transition"
            >
              {CULTIVATION_METHODS.map((m) => (
                <option key={m.value} value={m.value} className="bg-[#07120b] text-zinc-300">{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium text-sm mb-1.5">
              URL de imagen (opcional)
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm bg-white/[0.04] text-zinc-50 placeholder:text-zinc-500 focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 outline-none transition"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-white/[0.06] border border-white/[0.10] text-zinc-300 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/[0.10] transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-lime-400 text-[#07120b] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-lime-300 transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear parcela'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
