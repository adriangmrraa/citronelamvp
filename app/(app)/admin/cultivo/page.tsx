import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/session';

const STATUS_STYLES: Record<string, string> = {
  Verde: 'bg-lime-400/10 text-lime-400',
  Amarillo: 'bg-yellow-400/10 text-yellow-400',
  Rojo: 'bg-red-500/10 text-red-400',
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
        <h1 className="text-2xl font-bold text-zinc-50">Cultivos — Panel Admin</h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          {crops ? `${crops.length} parcelas en el sistema` : 'Error al cargar datos'}
        </p>
      </div>

      {crops === null && (
        <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl text-sm">
          No se pudieron cargar los cultivos
        </div>
      )}

      {crops && crops.length === 0 && (
        <div className="text-center py-16 bg-white/[0.03] rounded-2xl border border-white/[0.08]">
          <p className="text-zinc-500">No hay parcelas registradas en el sistema</p>
        </div>
      )}

      {crops && crops.length > 0 && (
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.04]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Usuario</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Parcela</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Método</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Creado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {crops.map((crop) => (
                  <tr
                    key={crop.id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-zinc-100">{crop.username}</p>
                        {crop.email && (
                          <p className="text-xs text-zinc-500">{crop.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-100">
                      {crop.bucketName}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {METHOD_LABELS[crop.cultivationMethod ?? ''] ?? crop.cultivationMethod ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[crop.status ?? ''] ?? 'bg-white/[0.06] text-zinc-400'}`}>
                        {crop.status ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
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
