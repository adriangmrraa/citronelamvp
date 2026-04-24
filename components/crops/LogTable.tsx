'use client';

import { useState } from 'react';
import { Trash2, ChevronRight } from 'lucide-react';
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
  Germinacion: 'bg-blue-400/10 text-blue-400',
  Vegetacion: 'bg-lime-400/10 text-lime-400',
  Floracion: 'bg-purple-400/10 text-purple-400',
  Senescencia: 'bg-orange-400/10 text-orange-400',
};

export default function LogTable({ logs, onDelete }: LogTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-600">
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
          <tr className="border-b border-white/[0.06]">
            <th className="text-left py-3 px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Semana</th>
            <th className="text-left py-3 px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Fase</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">pH</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">EC</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Grow</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Micro</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Bloom</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Luz (h)</th>
            <th className="py-3 px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Feedback</th>
            <th className="py-3 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <>
              <tr
                key={log.id}
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                className="border-b border-white/[0.04] hover:bg-white/[0.03] cursor-pointer transition-colors"
              >
                <td className="py-3 px-3 font-medium text-zinc-100">
                  <span className="flex items-center gap-1.5">
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${expandedId === log.id ? 'rotate-90' : ''}`}
                    />
                    {log.week}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PHASE_STYLES[log.phase ?? 'Vegetacion'] ?? 'bg-white/[0.06] text-zinc-400'}`}>
                    {log.phase ?? '—'}
                  </span>
                </td>
                <td className="py-3 px-3 text-right text-zinc-300">{log.ph ?? '—'}</td>
                <td className="py-3 px-3 text-right text-zinc-300">{log.ec ?? '—'}</td>
                <td className="py-3 px-3 text-right text-zinc-300">{log.grow ?? 0} ml</td>
                <td className="py-3 px-3 text-right text-zinc-300">{log.micro ?? 0} ml</td>
                <td className="py-3 px-3 text-right text-zinc-300">{log.bloom ?? 0} ml</td>
                <td className="py-3 px-3 text-right text-zinc-300">{log.lightHours ?? '—'}</td>
                <td className="py-3 px-3 max-w-[160px]">
                  {log.feedback ? (
                    <span className="text-xs text-lime-400 line-clamp-1" title={log.feedback}>
                      {log.feedback}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-500">—</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('¿Eliminar este registro?')) onDelete(log.id);
                      }}
                      className="text-zinc-500 hover:text-red-400 transition-colors p-1 rounded"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>

              {expandedId === log.id && (
                <tr key={`${log.id}-expanded`} className="bg-white/[0.02]">
                  <td colSpan={10} className="px-6 py-4">
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      {log.notes && (
                        <div>
                          <p className="text-xs font-semibold text-zinc-500 uppercase mb-1">Notas</p>
                          <p className="text-zinc-300">{log.notes}</p>
                        </div>
                      )}
                      {log.nutrientsSolution && (
                        <div>
                          <p className="text-xs font-semibold text-zinc-500 uppercase mb-1">Solución de Nutrientes</p>
                          <p className="text-zinc-300">{log.nutrientsSolution}</p>
                        </div>
                      )}
                      {log.sanitaryNotes && (
                        <div>
                          <p className="text-xs font-semibold text-zinc-500 uppercase mb-1">Notas Sanitarias</p>
                          <p className="text-zinc-300">{log.sanitaryNotes}</p>
                        </div>
                      )}
                      {log.preventives && (
                        <div>
                          <p className="text-xs font-semibold text-zinc-500 uppercase mb-1">Preventivos</p>
                          <p className="text-zinc-300">{log.preventives}</p>
                        </div>
                      )}
                      {!log.notes && !log.nutrientsSolution && !log.sanitaryNotes && !log.preventives && (
                        <p className="text-zinc-600 text-xs col-span-2">Sin información adicional</p>
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
