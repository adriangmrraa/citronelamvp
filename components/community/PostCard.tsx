'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare, ThumbsUp, Pin, Lock } from 'lucide-react';

export interface PostCardData {
  id: number;
  title: string;
  category: string;
  author: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  isImmutable: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Clases: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Investigaciones: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  FAQ: 'bg-green-500/10 text-green-400 border border-green-500/20',
  Debates: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  Papers: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  Noticias: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  Anuncios: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface PostCardProps {
  post: PostCardData;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const categoryColor = CATEGORY_COLORS[post.category] ?? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';

  return (
    <div
      onClick={() => router.push(`/community/${post.id}`)}
      className={`group rounded-2xl glass-surface transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/[0.20] hover:shadow-lg hover:shadow-lime-400/[0.05] p-5 cursor-pointer overflow-hidden ${
        post.isPinned ? 'ring-1 ring-lime-400/30' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {post.isPinned && (
            <span className="text-xs font-semibold bg-lime-400/10 text-lime-400 border border-lime-400/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Pin className="w-3.5 h-3.5 text-lime-400" />
              Fijado
            </span>
          )}
          {post.isImmutable && (
            <span className="text-xs font-semibold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              Bloqueado
            </span>
          )}
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryColor}`}>
            {post.category}
          </span>
        </div>
      </div>

      <h3 className="mt-3 text-base font-semibold text-zinc-50 leading-snug">
        {post.title}
      </h3>

      <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-gradient-to-br from-lime-400/30 to-green-600/30 rounded-full flex items-center justify-center text-lime-400 text-xs font-bold shrink-0">
            {post.author.charAt(0).toUpperCase()}
          </div>
          <span>{post.author}</span>
          <span>·</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>

        <div className="flex items-center gap-4 text-zinc-500">
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            {post.likesCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            {post.commentsCount}
          </span>
        </div>
      </div>
    </div>
  );
}
