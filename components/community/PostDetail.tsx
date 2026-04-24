'use client';

import { Download, Pin, Lock } from 'lucide-react';
import ReactionBar, { type ReactionCounts, type ReactionType } from './ReactionBar';
import SubscribeButton from './SubscribeButton';

const CATEGORY_COLORS: Record<string, string> = {
  Clases: 'bg-blue-400/15 text-blue-400',
  Investigaciones: 'bg-purple-400/15 text-purple-400',
  FAQ: 'bg-lime-400/15 text-lime-400',
  Debates: 'bg-orange-400/15 text-orange-400',
  Papers: 'bg-indigo-400/15 text-indigo-400',
  Noticias: 'bg-cyan-400/15 text-cyan-400',
  Anuncios: 'bg-red-400/15 text-red-400',
};

export interface PostDetailData {
  id: number;
  title: string;
  content: string;
  category: string;
  authorUsername: string;
  createdAt: string;
  isPinned: boolean;
  isImmutable: boolean;
  youtubeLink?: string | null;
  fileUrl?: string | null;
}

interface PostDetailProps {
  post: PostDetailData;
  reactions: ReactionCounts;
  userReaction: ReactionType | null;
  isSubscribed?: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname.includes('youtube.com')) {
      videoId = parsed.searchParams.get('v');
    } else if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.slice(1);
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

function exportAsText(post: PostDetailData) {
  const lines = [
    post.title,
    '='.repeat(post.title.length),
    '',
    `Autor: ${post.authorUsername}`,
    `Categoría: ${post.category}`,
    `Fecha: ${formatDate(post.createdAt)}`,
    '',
    post.content,
  ];
  if (post.youtubeLink) lines.push('', `Video: ${post.youtubeLink}`);
  if (post.fileUrl) lines.push(`Archivo: ${post.fileUrl}`);

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${post.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PostDetail({ post, reactions, userReaction, isSubscribed = false }: PostDetailProps) {
  const categoryColor = CATEGORY_COLORS[post.category] ?? 'bg-white/[0.06] text-zinc-400';
  const embedUrl = post.youtubeLink ? getYoutubeEmbedUrl(post.youtubeLink) : null;

  return (
    <article className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
      <div className="p-6 md:p-8">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {post.isPinned && (
            <span className="flex items-center gap-1 text-xs font-semibold bg-lime-400/10 text-lime-400 px-2.5 py-1 rounded-full">
              <Pin className="w-3 h-3" />
              Fijado
            </span>
          )}
          {post.isImmutable && (
            <span className="flex items-center gap-1 text-xs font-semibold bg-white/[0.06] text-zinc-400 px-2.5 py-1 rounded-full">
              <Lock className="w-3 h-3" />
              Bloqueado
            </span>
          )}
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor}`}>
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-50 leading-tight mb-3">
          {post.title}
        </h1>

        {/* Author + date */}
        <div className="flex items-center gap-2 mb-6 text-sm text-zinc-400">
          <div className="w-6 h-6 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center text-[#07120b] text-xs font-bold">
            {post.authorUsername.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-zinc-300">{post.authorUsername}</span>
          <span>·</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>

        {/* Content */}
        <div className="prose max-w-none mb-6">
          {post.content.split('\n').map((para, i) =>
            para.trim() ? (
              <p key={i} className="text-zinc-300 leading-relaxed mb-4 last:mb-0">
                {para}
              </p>
            ) : (
              <br key={i} />
            )
          )}
        </div>

        {/* YouTube embed */}
        {embedUrl && (
          <div className="mb-6 rounded-xl overflow-hidden aspect-video">
            <iframe
              src={embedUrl}
              title="Video YouTube"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* File download */}
        {post.fileUrl && (
          <a
            href={post.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 mb-6 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-zinc-300 hover:bg-white/[0.07] transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Descargar archivo adjunto
          </a>
        )}

        {/* Reactions + Actions */}
        <div className="border-t border-white/[0.08] pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <ReactionBar
            postId={post.id}
            reactions={reactions}
            userReaction={userReaction}
          />
          <div className="flex items-center gap-2">
            <SubscribeButton postId={post.id} initialSubscribed={isSubscribed} />
            <button
              onClick={() => exportAsText(post)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
