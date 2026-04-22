'use client';

import { useState, useEffect, useCallback } from 'react';
import CropCard from '@/components/crops/CropCard';
import CropForm from '@/components/crops/CropForm';
import type { Crop } from '@/db/schema';

export default function CultivoPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCrops = useCallback(async () => {
    try {
      const res = await fetch('/api/crops');
      if (!res.ok) throw new Error('Error al cargar cultivos');
      const data = await res.json();
      setCrops(data.crops ?? []);
    } catch {
      setError('No se pudieron cargar los cultivos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  function handleCropCreated(crop: Crop) {
    setCrops((prev) => [crop, ...prev]);
    setShowForm(false);
  }

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mi Cultivo</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {crops.length} {crops.length === 1 ? 'parcela registrada' : 'parcelas registradas'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#16A34A] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#14532D] transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Parcela
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Empty state */}
      {crops.length === 0 && !error && (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-green-400 dark:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.22 19.778l.707-.707M18.364 5.636l.707-.707" />
              <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Sin parcelas todavía</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-6">
            Creá tu primera parcela para empezar a registrar el progreso de tus plantas
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#16A34A] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#14532D] transition-colors"
          >
            Crear primera parcela
          </button>
        </div>
      )}

      {/* Crops grid */}
      {crops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <CropForm
          onSuccess={handleCropCreated}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
