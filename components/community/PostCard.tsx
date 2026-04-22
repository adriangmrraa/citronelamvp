'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare, ThumbsUp } from 'lucide-react';

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
  Clases: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Investigaciones: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  FAQ: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Debates: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Papers: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  Noticias: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  Anuncios: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
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
  const categoryColor = CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700';

  return (
    <div
      onClick={() => router.push(`/community/${post.id}`)}
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
        post.isPinned ? 'ring-2 ring-green-500 ring-offset-1' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {post.isPinned && (
            <span className="text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
              📌 Fijado
            </span>
          )}
          {post.isImmutable && (
            <span className="text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2 py-0.5 rounded-full">
              🔒 Bloqueado
            </span>
          )}
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryColor}`}>
            {post.category}
          </span>
        </div>
      </div>

      <h3 className="mt-3 text-base font-semibold text-gray-800 dark:text-gray-100 leading-snug">
        {post.title}
      </h3>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            {post.author.charAt(0).toUpperCase()}
          </div>
          <span>{post.author}</span>
          <span>·</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>

        <div className="flex items-center gap-4">
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
