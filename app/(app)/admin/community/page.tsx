'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pin, PinOff, Lock, Unlock, Trash2, RefreshCw } from 'lucide-react';

interface AdminPost {
  id: number;
  title: string;
  authorUsername: string;
  category: string;
  likesCount: number;
  createdAt: string;
  isPinned: boolean;
  isImmutable: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/posts');
      if (!res.ok) throw new Error('Error al cargar publicaciones');
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const applyAction = async (
    postId: number,
    payload: Partial<{ isPinned: boolean; isImmutable: boolean; deleted: boolean }>
  ) => {
    setActionLoading(postId);
    try {
      if (payload.deleted) {
        const res = await fetch(`/api/admin/posts/${postId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar');
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        return;
      }

      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      const data = await res.json();
      const updated = data.post ?? data;
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, ...updated } : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = (postId: number) => {
    if (!confirm('¿Eliminar esta publicación? Esta acción es irreversible.')) return;
    applyAction(postId, { deleted: true });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">
            Moderación del foro
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Gestioná las publicaciones de la comunidad
          </p>
        </div>
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-zinc-400 hover:bg-white/[0.06] transition-colors text-sm font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-5 py-4 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-white/[0.04] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            No hay publicaciones
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.04]">
                  <th className="text-left px-5 py-3 font-semibold text-zinc-400">
                    Título
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-400">
                    Autor
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-400">
                    Categoría
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-zinc-400">
                    Likes
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-400">
                    Fecha
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-zinc-400">
                    Fijado
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-zinc-400">
                    Bloqueado
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-zinc-400">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const isActing = actionLoading === post.id;
                  return (
                    <tr
                      key={post.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-zinc-100 max-w-xs truncate">
                        {post.title}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {post.authorUsername}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {post.category}
                      </td>
                      <td className="px-4 py-3 text-center text-zinc-400">
                        {post.likesCount}
                      </td>
                      <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            post.isPinned ? 'bg-lime-400' : 'bg-white/[0.12]'
                          }`}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            post.isImmutable ? 'bg-orange-500' : 'bg-white/[0.12]'
                          }`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Pin/Unpin */}
                          <button
                            onClick={() => applyAction(post.id, { isPinned: !post.isPinned })}
                            disabled={isActing}
                            title={post.isPinned ? 'Desfijar' : 'Fijar'}
                            className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-lime-400 hover:bg-lime-400/10 transition-all disabled:opacity-40"
                          >
                            {post.isPinned ? (
                              <PinOff className="w-4 h-4" />
                            ) : (
                              <Pin className="w-4 h-4" />
                            )}
                          </button>

                          {/* Lock/Unlock */}
                          <button
                            onClick={() =>
                              applyAction(post.id, { isImmutable: !post.isImmutable })
                            }
                            disabled={isActing}
                            title={post.isImmutable ? 'Desbloquear' : 'Bloquear'}
                            className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-orange-400/10 transition-all disabled:opacity-40"
                          >
                            {post.isImmutable ? (
                              <Unlock className="w-4 h-4" />
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={isActing}
                            title="Eliminar"
                            className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-zinc-600 text-center">
        {posts.length} publicación{posts.length !== 1 ? 'es' : ''} en total
      </p>
    </div>
  );
}
