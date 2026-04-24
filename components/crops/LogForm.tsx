'use client';

import { useState } from 'react';
import type { CropLog } from '@/db/schema';

const PHASES = [
  { value: 'Germinacion', label: 'Germinación' },
  { value: 'Vegetacion', label: 'Vegetación' },
  { value: 'Floracion', label: 'Floración' },
  { value: 'Senescencia', label: 'Senescencia' },
] as const;

interface LogFormProps {
  cropId: number;
  onSuccess: (log: CropLog) => void;
  onCancel: () => void;
}

export default function LogForm({ cropId, onSuccess, onCancel }: LogFormProps) {
  const [form, setForm] = useState({
    week: '',
    phase: 'Vegetacion' as string,
    ph: 6.0,
    ec: 1.2,
    grow: 0,
    micro: 0,
    bloom: 0,
    lightHours: 18,
    notes: '',
    nutrientsSolution: '',
    sanitaryNotes: '',
    preventives: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.week.trim()) {
      setError('Semana requerida');
      return;
    }
    if (form.ph < 0 || form.ph > 14) {
      setError('pH debe estar entre 0 y 14');
      return;
    }
    if (form.ec < 0) {
      setError('EC no puede ser negativa');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/crops/${cropId}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          week: form.week.trim(),
          notes: form.notes.trim() || null,
          nutrientsSolution: form.nutrientsSolution.trim() || null,
          sanitaryNotes: form.sanitaryNotes.trim() || null,
          preventives: form.preventives.trim() || null,
          imageUrl: form.imageUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Error al guardar');
        return;
      }

      onSuccess(data.log);
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full border border-white/[0.08] rounded-xl px-3 py-2 text-sm bg-white/[0.04] text-zinc-100 focus:ring-2 focus:ring-lime-400/50 focus:border-transparent outline-none transition';
  const labelClass = 'block text-xs font-medium text-zinc-400 mb-1';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#07120b] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="p-6 border-b border-white/[0.08]">
          <h2 className="text-xl font-bold text-zinc-50">Nuevo Registro Semanal</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Row 1 — Week + Phase */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Semana *</label>
              <input
                type="text"
                value={form.week}
                onChange={(e) => update('week', e.target.value)}
                placeholder="ej: Semana 5"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Fase fenológica</label>
              <select
                value={form.phase}
                onChange={(e) => update('phase', e.target.value)}
                className={inputClass}
              >
                {PHASES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2 — pH + EC + Light */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>pH</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={form.ph}
                onChange={(e) => update('ph', parseFloat(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>EC (mS/cm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.ec}
                onChange={(e) => update('ec', parseFloat(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Horas de Luz</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={form.lightHours}
                onChange={(e) => update('lightHours', parseFloat(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 3 — Nutrients */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Grow (ml/L)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={form.grow}
                onChange={(e) => update('grow', parseFloat(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Micro (ml/L)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={form.micro}
                onChange={(e) => update('micro', parseFloat(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Bloom (ml/L)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={form.bloom}
                onChange={(e) => update('bloom', parseFloat(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notas generales</label>
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={2}
              placeholder="Observaciones del cultivo..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Solución de nutrientes</label>
            <input
              type="text"
              value={form.nutrientsSolution}
              onChange={(e) => update('nutrientsSolution', e.target.value)}
              placeholder="ej: Flora Series 3-part"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Notas sanitarias</label>
              <textarea
                value={form.sanitaryNotes}
                onChange={(e) => update('sanitaryNotes', e.target.value)}
                rows={2}
                placeholder="Estado fitosanitario..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Preventivos aplicados</label>
              <textarea
                value={form.preventives}
                onChange={(e) => update('preventives', e.target.value)}
                rows={2}
                placeholder="Fungicidas, insecticidas..."
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>URL de imagen (opcional)</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 border border-white/[0.08] text-zinc-300 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/[0.04] transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-lime-400 text-[#07120b] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-lime-300 transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
