'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Crop, CropLog, LabReport } from '@/db/schema';
import CropForm from '@/components/crops/CropForm';
import LogTable from '@/components/crops/LogTable';
import LogForm from '@/components/crops/LogForm';
import LabReportCard from '@/components/crops/LabReportCard';
import LabReportForm from '@/components/crops/LabReportForm';
import NutrientCalculator from '@/components/crops/NutrientCalculator';

const STATUS_STYLES: Record<string, string> = {
  Verde: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Amarillo: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Rojo: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const STATUS_OPTIONS = ['Verde', 'Amarillo', 'Rojo'] as const;

export default function CropDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cropId = parseInt(params.id as string, 10);

  const [crop, setCrop] = useState<Crop | null>(null);
  const [logs, setLogs] = useState<CropLog[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showEditCrop, setShowEditCrop] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [showLabForm, setShowLabForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [deletingCrop, setDeletingCrop] = useState(false);

  // Status quick-update
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/crops/${cropId}`);
      if (res.status === 404) {
        setError('Cultivo no encontrado');
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCrop(data.crop);
      setLogs(data.logs);
      setLabReports(data.labReports);
    } catch {
      setError('No se pudo cargar el cultivo');
    } finally {
      setLoading(false);
    }
  }, [cropId]);

  useEffect(() => {
    if (!isNaN(cropId)) fetchData();
    else setError('ID de cultivo inválido');
  }, [cropId, fetchData]);

  async function handleDeleteCrop() {
    if (!confirm('¿Eliminar esta parcela y todos sus registros?')) return;
    setDeletingCrop(true);
    try {
      const res = await fetch(`/api/crops/${cropId}`, { method: 'DELETE' });
      if (res.ok) router.push('/cultivo');
    } catch {
      setError('Error al eliminar');
    } finally {
      setDeletingCrop(false);
    }
  }

  async function handleDeleteLog(logId: number) {
    try {
      const res = await fetch(`/api/crops/${cropId}/logs/${logId}`, { method: 'DELETE' });
      if (res.ok) setLogs((prev) => prev.filter((l) => l.id !== logId));
    } catch {
      setError('Error al eliminar registro');
    }
  }

  async function handleDeleteReport(reportId: number) {
    try {
      const res = await fetch(`/api/crops/${cropId}/lab-reports/${reportId}`, { method: 'DELETE' });
      if (res.ok) setLabReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch {
      setError('Error al eliminar reporte');
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!crop || updatingStatus) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/crops/${cropId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setCrop(data.crop);
      }
    } catch {
      // silent
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center py-20">
        <p className="text-red-500 dark:text-red-400 mb-4">{error ?? 'Cultivo no encontrado'}</p>
        <button
          onClick={() => router.push('/cultivo')}
          className="text-[#16A34A] hover:underline text-sm"
        >
          Volver a mis cultivos
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/cultivo')}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#16A34A] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Mis Cultivos
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCalculator((v) => !v)}
            className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Calculadora
          </button>
          <button
            onClick={() => setShowEditCrop(true)}
            className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Editar
          </button>
          <button
            onClick={handleDeleteCrop}
            disabled={deletingCrop}
            className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-red-600 dark:text-red-400 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>

      {/* Crop header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex items-start gap-4">
          {crop.imageUrl ? (
            <img
              src={crop.imageUrl}
              alt={crop.bucketName}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-9 h-9 text-green-400 dark:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.22 19.778l.707-.707M18.364 5.636l.707-.707" />
                <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{crop.bucketName}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{crop.cultivationMethod}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Estado:</span>
              <div className="flex gap-1.5">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={updatingStatus}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                      crop.status === s
                        ? STATUS_STYLES[s]
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:opacity-80'
                    } disabled:opacity-50`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-400 dark:text-gray-500 flex-shrink-0">
            <p>{logs.length} registros</p>
            <p>{labReports.length} reportes</p>
          </div>
        </div>
      </div>

      {/* Nutrient calculator (collapsible) */}
      {showCalculator && <NutrientCalculator />}

      {/* Weekly logs section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Registros Semanales</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{logs.length} entradas</p>
          </div>
          <button
            onClick={() => setShowLogForm(true)}
            className="flex items-center gap-1.5 text-sm bg-[#16A34A] text-white px-3.5 py-2 rounded-xl hover:bg-[#14532D] transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Log
          </button>
        </div>
        <div className="p-1">
          <LogTable
            logs={logs}
            onDelete={handleDeleteLog}
          />
        </div>
      </div>

      {/* Lab reports section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Reportes de Laboratorio</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{labReports.length} reportes</p>
          </div>
          <button
            onClick={() => setShowLabForm(true)}
            className="flex items-center gap-1.5 text-sm border border-[#16A34A] text-[#16A34A] px-3.5 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Reporte
          </button>
        </div>
        <div className="p-5">
          {labReports.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-600">
              <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <p className="text-sm">Sin reportes todavía</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {labReports.map((report) => (
                <LabReportCard
                  key={report.id}
                  report={report}
                  onDelete={handleDeleteReport}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showEditCrop && (
        <CropForm
          crop={crop}
          onSuccess={(updated) => {
            setCrop(updated);
            setShowEditCrop(false);
          }}
          onCancel={() => setShowEditCrop(false)}
        />
      )}

      {showLogForm && (
        <LogForm
          cropId={cropId}
          onSuccess={(log) => {
            setLogs((prev) => [log, ...prev]);
            setShowLogForm(false);
          }}
          onCancel={() => setShowLogForm(false)}
        />
      )}

      {showLabForm && (
        <LabReportForm
          cropId={cropId}
          onSuccess={(report) => {
            setLabReports((prev) => [report, ...prev]);
            setShowLabForm(false);
          }}
          onCancel={() => setShowLabForm(false)}
        />
      )}
    </div>
  );
}
