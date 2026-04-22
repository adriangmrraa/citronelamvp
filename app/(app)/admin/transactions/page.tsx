import TransactionTable from '@/components/admin/TransactionTable';
import ExportButton from '@/components/shared/ExportButton';

async function getTransactions() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/admin/transactions`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.transactions ?? [];
  } catch {
    return [];
  }
}

export default async function AdminTransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Transacciones de tokens</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Historial completo de movimientos</p>
        </div>
        <ExportButton
          url="/api/admin/transactions/export"
          filename={`transacciones-${new Date().toISOString().slice(0, 10)}.csv`}
        />
      </div>

      <TransactionTable transactions={transactions} />
    </div>
  );
}
