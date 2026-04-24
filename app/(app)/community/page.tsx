'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import CategoryFilter from '@/components/community/CategoryFilter';
import PostCard, { type PostCardData } from '@/components/community/PostCard';
import PostForm from '@/components/community/PostForm';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

type SortOption = 'nuevo' | 'popular';

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('nuevo');
  const [showForm, setShowForm] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/posts');
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

  const filtered = posts
    .filter((p) => (category === 'Todos' ? true : p.category === category))
    .filter((p) => (search.trim() ? p.title.toLowerCase().includes(search.toLowerCase()) : true))
    .sort((a, b) => {
      if (sort === 'popular') return b.likesCount - a.likesCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handlePostCreated = (postId: number) => {
    router.push(`/community/${postId}`);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.04] animate-bg-drift bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg/community.jpg')" }}
      />

      {showForm && (
        <PostForm
          onClose={() => setShowForm(false)}
          onSuccess={handlePostCreated}
        />
      )}

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Comunidad</h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              Compartí experiencias, debatí y aprendé
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-lime-400 hover:bg-lime-300 text-[#07120b] text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo post
          </button>
        </div>

        {/* Search + Sort */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar publicaciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-white/[0.04] border border-white/[0.08] text-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/40 transition"
          >
            <option value="nuevo">Más nuevo</option>
            <option value="popular">Más popular</option>
          </select>
        </div>

        {/* Category filter */}
        <CategoryFilter active={category} onChange={setCategory} />

        {/* Posts */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 bg-white/[0.04] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-900/20 border border-red-800/50 text-red-400 rounded-xl px-5 py-4 text-sm">
            {error}
            <button onClick={fetchPosts} className="ml-3 underline font-medium">
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400">
              {search || category !== 'Todos'
                ? 'No hay publicaciones que coincidan con tu búsqueda.'
                : 'Todavía no hay publicaciones. Sé el primero!'}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
