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
          ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20 hover:bg-lime-400/15'
          : 'bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:text-zinc-200 hover:bg-white/[0.06]'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {subscribed ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
      {subscribed ? 'Suscripto' : 'Suscribirse'}
    </button>
  );
}
