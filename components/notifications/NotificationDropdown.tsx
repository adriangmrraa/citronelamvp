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
    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Notificaciones</h3>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleReadAll}
            className="text-xs text-[#16A34A] hover:text-[#14532D] font-medium transition-colors"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
            Sin notificaciones pendientes
          </div>
        ) : (
          notifications.slice(0, 10).map((n) => (
            <NotificationItem key={n.id} notification={n} onRead={onRead} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2.5 text-center">
        <Link
          href="/notifications"
          className="text-xs text-[#16A34A] hover:text-[#14532D] font-medium transition-colors"
        >
          Ver todas
        </Link>
      </div>
    </div>
  );
}
