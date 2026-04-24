import Link from 'next/link';
import KpiGrid from '@/components/admin/KpiGrid';
import { Users, Sprout, MessageSquare, Coins, CalendarDays, FileText, Receipt } from 'lucide-react';

async function getAdminStats() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/admin/stats`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  const quickLinks = [
    { href: '/admin/users', label: 'Gestión de usuarios', icon: Users },
    { href: '/admin/cultivo', label: 'Parcelas y cultivos', icon: Sprout },
    { href: '/admin/community', label: 'Comunidad', icon: MessageSquare },
    { href: '/admin/transactions', label: 'Transacciones de tokens', icon: Receipt },
    { href: '/admin/events', label: 'Eventos', icon: CalendarDays },
    { href: '/admin/legal', label: 'Contenido legal', icon: FileText },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Panel de Administración</h1>
        <p className="text-zinc-400 mt-1">Resumen general del sistema</p>
      </div>

      <KpiGrid
        stats={{
          totalUsuarios: stats?.totalUsuarios,
          pendientes: stats?.pendientes,
          tasaVerificacion: stats?.tasaVerificacion,
          totalParcelas: stats?.totalParcelas,
          ordenes: stats?.ordenes,
          tokensCirculacion: stats?.tokensCirculacion,
          postsSemana: stats?.postsSemana,
          eventos: stats?.eventos,
        }}
      />

      <div>
        <h2 className="text-lg font-semibold text-zinc-50 mb-4">Acceso rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.08] hover:border-lime-400/50 transition-colors bg-white/[0.03]"
            >
              <div className="w-9 h-9 rounded-lg bg-lime-400/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-lime-400" />
              </div>
              <span className="font-medium text-zinc-200 text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
