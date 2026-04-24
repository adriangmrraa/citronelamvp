'use client';

import Link from 'next/link';
import NotificationItem, { type NotificationData } from './NotificationItem';

interface NotificationDropdownProps {
  notifications: NotificationData[];
  onRead: (id: number) => void;
  onReadAll: () => void;
}

export default function NotificationDropdown({
  notifications,
  onRead,
  onReadAll,
}: NotificationDropdownProps) {
  const handleReadAll = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      onReadAll();
    } catch {
      // silencioso
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 glass-surface rounded-xl shadow-xl shadow-black/40 backdrop-blur-xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <h3 className="font-semibold text-sm text-zinc-100">Notificaciones</h3>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleReadAll}
            className="text-xs text-lime-400 hover:text-lime-300 font-medium transition-colors"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-zinc-500">
            Sin notificaciones pendientes
          </div>
        ) : (
          notifications.slice(0, 10).map((n) => (
            <NotificationItem key={n.id} notification={n} onRead={onRead} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-4 py-2.5 text-center">
        <Link
          href="/notifications"
          className="text-xs text-lime-400 hover:text-lime-300 font-medium transition-colors"
        >
          Ver todas
        </Link>
      </div>
    </div>
  );
}
