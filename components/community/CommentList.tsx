'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export interface Comment {
  id: number;
  content: string;
  authorUsername: string;
  createdAt: string;
  userId?: number;
}

interface CommentListProps {
  comments: Comment[];
  currentUserId?: number;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CommentList({
  comments,
  currentUserId,
  isAdmin = false,
  onDelete,
}: CommentListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (comments.length === 0) {
    return (
      <p className="text-sm text-zinc-500 text-center py-6">
        Todavía no hay comentarios. ¡Sé el primero!
      </p>
    );
  }

  const sorted = [...comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este comentario?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      if (res.ok) onDelete?.(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {sorted.map((comment) => {
        const canDelete = isAdmin || comment.userId === currentUserId;
        return (
          <div
            key={comment.id}
            className="flex gap-3 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center text-[#07120b] text-xs font-bold shrink-0 mt-0.5">
              {comment.authorUsername.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-zinc-100">
                    {comment.authorUsername}
                  </span>
                  <span className="text-zinc-600 text-xs">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                {canDelete && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={deletingId === comment.id}
                    className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-7 h-7 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-30"
                    title="Eliminar comentario"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-400 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
