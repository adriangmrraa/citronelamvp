import NotificationSender from '@/components/admin/NotificationSender';
import { Bell } from 'lucide-react';

async function getTodayStats() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/admin/notifications/stats`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AdminNotificationsPage() {
  const stats = await getTodayStats();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-lime-400/10 flex items-center justify-center">
          <Bell className="w-5 h-5 text-lime-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-50">Notificaciones</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Enviá mensajes a usuarios o grupos
          </p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-4">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Enviadas hoy
            </p>
            <p className="text-2xl font-bold text-zinc-50 mt-1">
              {stats.today ?? 0}
            </p>
          </div>
          <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-4">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Total acumuladas
            </p>
            <p className="text-2xl font-bold text-zinc-50 mt-1">
              {stats.total ?? 0}
            </p>
          </div>
          <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-4">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Sin leer (global)
            </p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {stats.unread ?? 0}
            </p>
          </div>
        </div>
      )}

      {/* Sender form */}
      <NotificationSender />
    </div>
  );
}
