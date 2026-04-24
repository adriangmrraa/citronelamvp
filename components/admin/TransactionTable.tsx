'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface Transaction {
  id: number;
  userId: number;
  username: string;
  amount: number;
  reason: string;
  createdAt: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onExport?: () => void;
}

const PAGE_SIZE = 20;

export default function TransactionTable({ transactions, onExport }: TransactionTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const paginated = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExport = () => {
    if (onExport) {
      onExport();
      return;
    }
    // fallback: build CSV client-side
    const headers = ['ID', 'Usuario', 'Monto', 'Razón', 'Fecha'];
    const rows = transactions.map((t) => [
      t.id,
      t.username,
      t.amount,
      `"${t.reason.replace(/"/g, '""')}"`,
      new Date(t.createdAt).toLocaleString('es-AR'),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transacciones-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          {transactions.length} transacción{transactions.length !== 1 ? 'es' : ''}
        </p>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-1.5" />
          Exportar CSV
        </Button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-center py-12 text-zinc-500 text-sm">
          No hay transacciones registradas.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.04] text-left">
                  <th className="px-4 py-3 font-semibold text-zinc-400">#</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Usuario</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Monto</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Razón</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {paginated.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3 text-zinc-500 text-xs">{tx.id}</td>
                    <td className="px-4 py-3 font-medium text-zinc-100">{tx.username}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold ${
                          tx.amount >= 0
                            ? 'text-lime-400'
                            : 'text-red-400'
                        }`}
                      >
                        {tx.amount >= 0 ? '+' : ''}{tx.amount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-300 max-w-xs truncate">{tx.reason}</td>
                    <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
              <span className="text-sm text-zinc-500">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
