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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Editar Parcela' : 'Nueva Parcela'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nombre de la parcela
            </label>
            <input
              type="text"
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
              placeholder="ej: Gorilla Glue #4"
              maxLength={100}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Método de cultivo
            </label>
            <select
              value={cultivationMethod}
              onChange={(e) => setCultivationMethod(e.target.value as typeof cultivationMethod)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition"
            >
              {CULTIVATION_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              URL de imagen (opcional)
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#16A34A] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#14532D] transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear parcela'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
