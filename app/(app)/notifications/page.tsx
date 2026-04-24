'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import NotificationItem, { type NotificationData } from '@/components/notifications/NotificationItem';

const PAGE_SIZE = 20;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (pageNum: number, append = false) => {
    try {
      const res = await fetch(`/api/notifications?page=${pageNum}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error('Error al cargar notificaciones');
      const data = await res.json();
      const items: NotificationData[] = data.notifications ?? [];
      setNotifications((prev) => (append ? [...prev, ...items] : items));
      setHasMore(items.length === PAGE_SIZE);
    } catch {
      setError('No se pudieron cargar las notificaciones');
    }
  }, []);

  useEffect(() => {
    fetchPage(1).finally(() => setLoading(false));
  }, [fetchPage]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchPage(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  const handleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleReadAll = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // silencioso
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-white/[0.04] rounded w-48" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-white/[0.04] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lime-400/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-lime-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-50">Notificaciones</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-zinc-500 mt-0.5">
                {unreadCount} sin leer
              </p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleReadAll}
            className="flex items-center gap-1.5 text-sm text-lime-400 hover:text-lime-300 font-medium transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todas como leídas
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Notification list */}
      {notifications.length === 0 && !error ? (
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] py-16 text-center">
          <Bell className="w-12 h-12 text-white/[0.10] mx-auto mb-4" />
          <p className="text-zinc-500 text-sm">No tenés notificaciones</p>
        </div>
      ) : (
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] overflow-hidden divide-y divide-white/[0.06]">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onRead={handleRead} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-sm font-medium text-zinc-400 hover:bg-white/[0.04] disabled:opacity-50 transition-colors"
          >
            {loadingMore ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}
    </div>
  );
}
