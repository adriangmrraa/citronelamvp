'use client';

import { useState } from 'react';

export type ReactionType = 'Interesante' | 'Util' | 'Cientifico';

export interface ReactionCounts {
  Interesante: number;
  Util: number;
  Cientifico: number;
}

interface ReactionBarProps {
  postId: number;
  reactions: ReactionCounts;
  userReaction: ReactionType | null;
  onReact?: (type: ReactionType) => void;
}

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'Interesante', emoji: '🧠', label: 'Interesante' },
  { type: 'Util', emoji: '👍', label: 'Útil' },
  { type: 'Cientifico', emoji: '🔬', label: 'Científico' },
];

export default function ReactionBar({ postId, reactions, userReaction, onReact }: ReactionBarProps) {
  const [counts, setCounts] = useState<ReactionCounts>(reactions);
  const [active, setActive] = useState<ReactionType | null>(userReaction);
  const [loading, setLoading] = useState(false);

  const handleReact = async (type: ReactionType) => {
    if (loading) return;
    setLoading(true);

    // Optimistic update
    const prev = active;
    const prevCounts = { ...counts };

    const newActive = active === type ? null : type;
    const newCounts = { ...counts };

    if (prev) newCounts[prev] = Math.max(0, newCounts[prev] - 1);
    if (newActive) newCounts[newActive] = newCounts[newActive] + 1;

    setActive(newActive);
    setCounts(newCounts);

    try {
      await fetch(`/api/posts/${postId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      onReact?.(type);
    } catch {
      // rollback
      setActive(prev);
      setCounts(prevCounts);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {REACTIONS.map(({ type, emoji, label }) => {
        const isActive = active === type;
        return (
          <button
            key={type}
            onClick={() => handleReact(type)}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 ring-1 ring-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span>{emoji}</span>
            <span>{label}</span>
            <span className="text-xs opacity-75">({counts[type]})</span>
          </button>
        );
      })}
    </div>
  );
}
