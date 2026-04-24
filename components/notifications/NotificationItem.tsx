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
      className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-white/[0.06] hover:bg-white/[0.04] transition-colors ${
        !notification.read ? 'bg-lime-400/[0.04]' : ''
      }`}
    >
      {/* Dot indicador */}
      <div className="mt-1.5 shrink-0">
        {!notification.read ? (
          <span className="w-2 h-2 rounded-full bg-lime-400 block" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-transparent block" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            !notification.read
              ? 'font-semibold text-zinc-100'
              : 'font-normal text-zinc-300'
          }`}
        >
          {notification.message}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
    </button>
  );
}
