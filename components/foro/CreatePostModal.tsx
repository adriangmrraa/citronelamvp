'use client';

import { useState } from 'react';
import { ForumCategory } from '@/types/forum';
import { X, Image as ImageIcon, Send } from 'lucide-react';

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (post: { title: string; content: string; category: ForumCategory; image?: string; author: any }) => void;
}

const CATEGORIES: ForumCategory[] = ['Investigación', 'Papers', 'Debate', 'Anuncio'];

export default function CreatePostModal({ onClose, onSubmit }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ForumCategory>('Debate');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    onSubmit({
      title,
      content,
      category,
      image: imageUrl || undefined,
      author: {
        name: 'Tú (Demo User)',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
        role: 'User'
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-[500px] glass-surface rounded-none overflow-hidden border border-lime-400/20 shadow-[0_0_50px_rgba(163,230,53,0.15)]">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-black text-zinc-100 uppercase tracking-tight">Sembrar Post</h2>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Categoría</label>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-none text-xs font-bold transition-all ${
                    category === cat
                      ? 'bg-lime-400 text-black shadow-lg shadow-lime-400/20'
                      : 'bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Título</label>
            <input 
              type="text" 
              placeholder="¿Qué tienes en mente?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-none py-3 px-4 text-zinc-100 focus:outline-none focus:border-lime-400/50 transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Contenido</label>
            <textarea 
              placeholder="Desarrolla tu idea..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-none py-3 px-4 text-zinc-100 focus:outline-none focus:border-lime-400/50 transition-colors resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">URL de Imagen (Opcional)</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-none py-3 px-4 pl-10 text-zinc-100 focus:outline-none focus:border-lime-400/50 transition-colors text-sm"
              />
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-lime-400 hover:bg-lime-300 text-[#07120b] font-black py-4 rounded-none flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-lime-400/20 mt-4"
          >
            <Send size={20} />
            PUBLICAR AHORA
          </button>
        </form>
      </div>
    </div>
  );
}
