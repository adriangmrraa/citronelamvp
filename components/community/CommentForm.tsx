'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

interface CommentFormProps {
  postId: number;
  onComment?: () => void;
}

export default function CommentForm({ postId, onComment }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error al publicar comentario');
      }

      setContent('');
      onComment?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-2">
          {error}
        </div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribí tu comentario..."
        rows={4}
        className="w-full border border-white/[0.08] rounded-xl px-4 py-3 bg-white/[0.04] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 transition resize-none"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-lime-400 text-[#07120b] text-sm font-semibold rounded-xl hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Publicando...' : 'Comentar'}
        </button>
      </div>
    </form>
  );
}
