'use client';

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
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
            Recolección
          </p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {formatDate(report.collectionDate)}
          </p>
          {report.plantId && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Planta: {report.plantId}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {report.reportUrl && (
            <a
              href={report.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#16A34A] hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar
            </a>
          )}
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('¿Eliminar este reporte?')) onDelete(report.id);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
              title="Eliminar reporte"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center"
            >
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                {KNOWN_LABELS[key.toLowerCase()] ?? key.toUpperCase()}
              </p>
              <p className="text-lg font-bold text-[#16A34A] dark:text-green-400 mt-0.5">
                {typeof value === 'number' ? `${value}%` : String(value)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-500">Sin resultados registrados</p>
      )}
    </div>
  );
}
