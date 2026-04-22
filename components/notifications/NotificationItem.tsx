'use client';

import { timeAgo } from '@/lib/utils/time';

export interface NotificationData {
  id: number;
  message: string;
  read: boolean;
  createdAt: string | Date;
}

interface NotificationItemProps {
  notification: NotificationData;
  onRead: (id: number) => void;
}

export default function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const handleClick = async () => {
    if (notification.read) return;

    try {
      await fetch(`/api/notifications/${notification.id}/read`, { method: 'POST' });
      onRead(notification.id);
    } catch {
      // silencioso — no bloqueamos la UX
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        !notification.read ? 'bg-green-50/50 dark:bg-green-900/10' : ''
      }`}
    >
      {/* Dot indicador */}
      <div className="mt-1.5 shrink-0">
        {!notification.read ? (
          <span className="w-2 h-2 rounded-full bg-[#16A34A] block" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-transparent block" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            !notification.read
              ? 'font-semibold text-gray-900 dark:text-gray-100'
              : 'font-normal text-gray-700 dark:text-gray-300'
          }`}
        >
          {notification.message}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
    </button>
  );
}
