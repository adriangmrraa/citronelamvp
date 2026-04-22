'use client';

import { useState } from 'react';
import type { LabReport } from '@/db/schema';

interface LabReportFormProps {
  cropId: number;
  onSuccess: (report: LabReport) => void;
  onCancel: () => void;
}

interface CannabinoidResults {
  thc: string;
  thca: string;
  cbd: string;
  cbda: string;
  cbg: string;
  cbn: string;
}

const EMPTY_RESULTS: CannabinoidResults = {
  thc: '',
  thca: '',
  cbd: '',
  cbda: '',
  cbg: '',
  cbn: '',
};

const RESULT_LABELS: Record<keyof CannabinoidResults, string> = {
  thc: 'THC (%)',
  thca: 'THCA (%)',
  cbd: 'CBD (%)',
  cbda: 'CBDA (%)',
  cbg: 'CBG (%)',
  cbn: 'CBN (%)',
};

export default function LabReportForm({ cropId, onSuccess, onCancel }: LabReportFormProps) {
  const [collectionDate, setCollectionDate] = useState('');
  const [plantId, setPlantId] = useState('');
  const [results, setResults] = useState<CannabinoidResults>({ ...EMPTY_RESULTS });
  const [reportUrl, setReportUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateResult(key: keyof CannabinoidResults, value: string) {
    setResults((prev) => ({ ...prev, [key]: value }));
  }

  function buildResultsJson(): string {
    const obj: Record<string, number> = {};
    for (const [key, val] of Object.entries(results)) {
      if (val !== '' && !isNaN(parseFloat(val))) {
        obj[key] = parseFloat(val);
      }
    }
    return JSON.stringify(obj);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!collectionDate) {
      setError('Fecha de recolección requerida');
      return;
    }

    const resultsJson = buildResultsJson();
    const parsed = JSON.parse(resultsJson);
    if (Object.keys(parsed).length === 0) {
      setError('Ingresá al menos un valor de cannabinoides');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/crops/${cropId}/lab-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionDate,
          plantId: plantId.trim() || null,
          results: resultsJson,
          reportUrl: reportUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Error al guardar');
        return;
      }

      onSuccess(data.labReport);
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition';
  const labelClass = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg my-8">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Nuevo Reporte de Laboratorio</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Fecha de recolección *</label>
              <input
                type="date"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>ID de planta (opcional)</label>
              <input
                type="text"
                value={plantId}
                onChange={(e) => setPlantId(e.target.value)}
                placeholder="ej: Planta A"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
              Cannabinoides (%)
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(EMPTY_RESULTS) as Array<keyof CannabinoidResults>).map((key) => (
                <div key={key}>
                  <label className={labelClass}>{RESULT_LABELS[key]}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={results[key]}
                    onChange={(e) => updateResult(key, e.target.value)}
                    placeholder="0.00"
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>URL del reporte (opcional)</label>
            <input
              type="text"
              value={reportUrl}
              onChange={(e) => setReportUrl(e.target.value)}
              placeholder="https://..."
              className={inputClass}
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
              {loading ? 'Guardando...' : 'Guardar reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
