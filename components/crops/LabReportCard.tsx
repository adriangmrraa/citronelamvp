'use client';

import { Trash2, Download } from 'lucide-react';
import type { LabReport } from '@/db/schema';

interface LabReportCardProps {
  report: LabReport;
  onDelete?: (reportId: number) => void;
}

function formatDate(date: Date | string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function parseResults(results: string): Record<string, unknown> {
  try {
    return JSON.parse(results);
  } catch {
    return {};
  }
}

const KNOWN_LABELS: Record<string, string> = {
  thc: 'THC',
  thca: 'THCA',
  cbd: 'CBD',
  cbda: 'CBDA',
  cbg: 'CBG',
  cbn: 'CBN',
  cbc: 'CBC',
};

export default function LabReportCard({ report, onDelete }: LabReportCardProps) {
  const results = parseResults(report.results);
  const entries = Object.entries(results);

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-0.5">
            Recolección
          </p>
          <p className="font-semibold text-zinc-100">
            {formatDate(report.collectionDate)}
          </p>
          {report.plantId && (
            <p className="text-xs text-zinc-500 mt-0.5">Planta: {report.plantId}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {report.reportUrl && (
            <a
              href={report.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-lime-400 hover:underline"
            >
              <Download className="w-4 h-4" />
              Descargar
            </a>
          )}
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('¿Eliminar este reporte?')) onDelete(report.id);
              }}
              className="text-zinc-500 hover:text-red-400 transition-colors p-1 rounded"
              title="Eliminar reporte"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="bg-white/[0.04] rounded-xl p-3 text-center"
            >
              <p className="text-xs font-semibold text-zinc-500 uppercase">
                {KNOWN_LABELS[key.toLowerCase()] ?? key.toUpperCase()}
              </p>
              <p className="text-lg font-bold text-lime-400 mt-0.5">
                {typeof value === 'number' ? `${value}%` : String(value)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-zinc-600">Sin resultados registrados</p>
      )}
    </div>
  );
}
