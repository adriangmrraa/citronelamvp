import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/session';

const STATUS_STYLES: Record<string, string> = {
  Verde: 'bg-green-100 text-green-800',
  Amarillo: 'bg-yellow-100 text-yellow-800',
  Rojo: 'bg-red-100 text-red-800',
};

const METHOD_LABELS: Record<string, string> = {
  Hidroponia: 'Hidroponia',
  Organico: 'Orgánico',
  SalesMinerales: 'Sales Minerales',
  Mixto: 'Mixto',
};

interface AdminCrop {
  id: number;
  bucketName: string;
  status: string | null;
  cultivationMethod: string | null;
  createdAt: Date | string | null;
  userId: number;
  username: string;
  email: string | null;
}

async function getAdminCrops(): Promise<AdminCrop[] | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/admin/crops`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.crops ?? [];
  } catch {
    return null;
  }
}

function formatDate(date: Date | string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default async function AdminCultivoPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/dashboard');
  }

  const crops = await getAdminCrops();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cultivos — Panel Admin</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {crops ? `${crops.length} parcelas en el sistema` : 'Error al cargar datos'}
        </p>
      </div>

      {crops === null && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          No se pudieron cargar los cultivos
        </div>
      )}

      {crops && crops.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="text-gray-400 dark:text-gray-500">No hay parcelas registradas en el sistema</p>
        </div>
      )}

      {crops && crops.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Usuario</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Parcela</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Método</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Creado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {crops.map((crop) => (
                  <tr
                    key={crop.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{crop.username}</p>
                        {crop.email && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">{crop.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {crop.bucketName}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {METHOD_LABELS[crop.cultivationMethod ?? ''] ?? crop.cultivationMethod ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[crop.status ?? ''] ?? 'bg-gray-100 text-gray-700'}`}>
                        {crop.status ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {formatDate(crop.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
