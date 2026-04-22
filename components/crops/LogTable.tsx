'use client';

import { useState } from 'react';
import type { CropLog } from '@/db/schema';

interface LogTableProps {
  logs: CropLog[];
  onDelete?: (logId: number) => void;
}

function formatDate(date: Date | string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
  });
}

const PHASE_STYLES: Record<string, string> = {
  Germinacion: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Vegetacion: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Floracion: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Senescencia: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

export default function LogTable({ logs, onDelete }: LogTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 dark:text-gray-600">
        <svg className="w-10 h-10 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm">Sin registros todavía</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Semana</th>
            <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fase</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">pH</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">EC</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Grow</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Micro</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bloom</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Luz (h)</th>
            <th className="py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Feedback</th>
            <th className="py-3 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <>
              <tr
                key={log.id}
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
              >
                <td className="py-3 px-3 font-medium text-gray-900 dark:text-gray-100">
                  <span className="flex items-center gap-1.5">
                    <svg
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expandedId === log.id ? 'rotate-90' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {log.week}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PHASE_STYLES[log.phase ?? 'Vegetacion']}`}>
                    {log.phase ?? '—'}
                  </span>
                </td>
                <td className="py-3 px-3 text-right text-gray-700 dark:text-gray-300">{log.ph ?? '—'}</td>
                <td className="py-3 px-3 text-right text-gray-700 dark:text-gray-300">{log.ec ?? '—'}</td>
                <td className="py-3 px-3 text-right text-gray-700 dark:text-gray-300">{log.grow ?? 0} ml</td>
                <td className="py-3 px-3 text-right text-gray-700 dark:text-gray-300">{log.micro ?? 0} ml</td>
                <td className="py-3 px-3 text-right text-gray-700 dark:text-gray-300">{log.bloom ?? 0} ml</td>
                <td className="py-3 px-3 text-right text-gray-700 dark:text-gray-300">{log.lightHours ?? '—'}</td>
                <td className="py-3 px-3 max-w-[160px]">
                  {log.feedback ? (
                    <span className="text-xs text-[#16A34A] dark:text-green-400 line-clamp-1" title={log.feedback}>
                      {log.feedback}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('¿Eliminar este registro?')) onDelete(log.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
                      title="Eliminar registro"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>

              {expandedId === log.id && (
                <tr key={`${log.id}-expanded`} className="bg-gray-50 dark:bg-gray-800/20">
                  <td colSpan={10} className="px-6 py-4">
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      {log.notes && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Notas</p>
                          <p className="text-gray-700 dark:text-gray-300">{log.notes}</p>
                        </div>
                      )}
                      {log.nutrientsSolution && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Solución de Nutrientes</p>
                          <p className="text-gray-700 dark:text-gray-300">{log.nutrientsSolution}</p>
                        </div>
                      )}
                      {log.sanitaryNotes && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Notas Sanitarias</p>
                          <p className="text-gray-700 dark:text-gray-300">{log.sanitaryNotes}</p>
                        </div>
                      )}
                      {log.preventives && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Preventivos</p>
                          <p className="text-gray-700 dark:text-gray-300">{log.preventives}</p>
                        </div>
                      )}
                      {!log.notes && !log.nutrientsSolution && !log.sanitaryNotes && !log.preventives && (
                        <p className="text-gray-400 dark:text-gray-500 text-xs col-span-2">Sin información adicional</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
