'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = [
  'Clases',
  'Investigaciones',
  'FAQ',
  'Debates',
  'Papers',
  'Noticias',
  'Anuncios',
] as const;

interface PostFormProps {
  postId?: number;
  initialValues?: {
    title: string;
    content: string;
    category: string;
    youtubeLink?: string;
    fileUrl?: string;
  };
  onClose: () => void;
  onSuccess?: (postId: number) => void;
}

export default function PostForm({ postId, initialValues, onClose, onSuccess }: PostFormProps) {
  const isEdit = Boolean(postId);

  const [form, setForm] = useState({
    title: initialValues?.title ?? '',
    content: initialValues?.content ?? '',
    category: initialValues?.category ?? 'Clases',
    youtubeLink: initialValues?.youtubeLink ?? '',
    fileUrl: initialValues?.fileUrl ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const url = isEdit ? `/api/posts/${postId}` : '/api/posts';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
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
      const id: number = isEdit ? postId! : (data.post?.id ?? data.id);
      onSuccess?.(id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#07120b] border border-white/[0.08] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <h2 className="text-lg font-semibold text-zinc-50">
            {isEdit ? 'Editar publicación' : 'Nueva publicación'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-zinc-300 font-medium text-sm mb-1">
              Título <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Título de tu publicación"
              className="w-full border border-white/[0.08] rounded-xl px-4 py-2.5 bg-white/[0.04] text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium text-sm mb-2">
              Categoría
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    form.category === cat
                      ? 'bg-lime-400 text-[#07120b]'
                      : 'bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:text-zinc-200 hover:bg-white/[0.08]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium text-sm mb-1">
              Contenido <span className="text-red-400">*</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Escribí tu contenido acá..."
              rows={8}
              className="w-full border border-white/[0.08] rounded-xl px-4 py-2.5 bg-white/[0.04] text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition resize-y"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium text-sm mb-1">
              Link de YouTube <span className="text-zinc-500 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              name="youtubeLink"
              value={form.youtubeLink}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full border border-white/[0.08] rounded-xl px-4 py-2.5 bg-white/[0.04] text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium text-sm mb-1">
              URL de archivo <span className="text-zinc-500 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              name="fileUrl"
              value={form.fileUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-white/[0.08] rounded-xl px-4 py-2.5 bg-white/[0.04] text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.10] text-zinc-300 hover:bg-white/[0.10] transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-[#07120b] text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
