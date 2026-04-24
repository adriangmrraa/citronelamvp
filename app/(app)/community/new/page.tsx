'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NewPostPage() {
  const router = useRouter();

  const handleSuccess = (postId: number) => {
    router.push(`/community/${postId}`);
  };

  const handleClose = () => {
    router.push('/community');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={handleClose}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-lime-400 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la comunidad
      </button>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-zinc-50 mb-6">
          Nueva publicación
        </h1>

        <InlinePostForm onClose={handleClose} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

// Inline variant — same logic but no modal wrapper
function InlinePostForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (postId: number) => void;
}) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Clases',
    youtubeLink: '',
    fileUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CATEGORIES = [
    'Clases',
    'Investigaciones',
    'FAQ',
    'Debates',
    'Papers',
    'Noticias',
    'Anuncios',
  ] as const;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('El título y el contenido son obligatorios.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
          category: form.category,
          youtubeLink: form.youtubeLink.trim() || null,
          fileUrl: form.fileUrl.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error al guardar el post');
      }

      const data = await res.json();
      const id: number = data.post?.id ?? data.id;
      onSuccess(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full border border-white/[0.08] rounded-xl px-4 py-2.5 bg-white/[0.04] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 transition';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Título <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título de tu publicación"
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Categoría
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Contenido <span className="text-red-400">*</span>
        </label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Escribí tu contenido acá..."
          rows={10}
          className={`${inputClass} resize-y`}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Link de YouTube <span className="text-zinc-500 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          name="youtubeLink"
          value={form.youtubeLink}
          onChange={handleChange}
          placeholder="https://youtube.com/watch?v=..."
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          URL de archivo <span className="text-zinc-500 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          name="fileUrl"
          value={form.fileUrl}
          onChange={handleChange}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-zinc-400 hover:bg-white/[0.04] transition-colors text-sm font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-lime-400 text-[#07120b] text-sm font-semibold hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </form>
  );
}
