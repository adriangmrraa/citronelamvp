'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Sprout } from 'lucide-react';
import CropCard from '@/components/crops/CropCard';
import CropForm from '@/components/crops/CropForm';
import { Button } from '@/components/ui/button';
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
          <div className="h-8 bg-white/[0.04] rounded w-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white/[0.04] rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6 max-w-5xl mx-auto space-y-6">
      {/* Background image */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.04] animate-bg-drift bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg/cultivo.jpg')" }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Mi Cultivo</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            {crops.length} {crops.length === 1 ? 'parcela registrada' : 'parcelas registradas'}
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-lime-400 hover:bg-lime-300 text-[#07120b] font-semibold"
        >
          <Plus className="w-4 h-4" />
          Nueva Parcela
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/20 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Empty state */}
      {crops.length === 0 && !error && (
        <div className="text-center py-20 glass-surface rounded-2xl border border-white/[0.08]">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/[0.04] rounded-2xl flex items-center justify-center">
            <Sprout className="w-12 h-12 text-zinc-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sin parcelas todavía</h2>
          <p className="text-zinc-400 text-sm max-w-sm mx-auto mb-6">
            Creá tu primera parcela para empezar a registrar el progreso de tus plantas
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-lime-400 hover:bg-lime-300 text-[#07120b] font-semibold"
          >
            Crear primera parcela
          </Button>
        </div>
      )}

      {/* Crops grid */}
      {crops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
