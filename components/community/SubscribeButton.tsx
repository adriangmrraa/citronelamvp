'use client';

import { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';

interface SubscribeButtonProps {
  postId: number;
  initialSubscribed?: boolean;
}

export default function SubscribeButton({ postId, initialSubscribed = false }: SubscribeButtonProps) {
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    const prev = subscribed;
    setSubscribed(!prev); // optimistic

    try {
      await fetch(`/api/posts/${postId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      setSubscribed(prev); // rollback
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        subscribed
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {subscribed ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
      {subscribed ? 'Suscripto' : 'Suscribirse'}
    </button>
  );
}
