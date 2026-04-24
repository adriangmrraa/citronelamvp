'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';
import PostDetail, { type PostDetailData } from '@/components/community/PostDetail';
import CommentList, { type Comment } from '@/components/community/CommentList';
import CommentForm from '@/components/community/CommentForm';
import type { ReactionCounts, ReactionType } from '@/components/community/ReactionBar';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [post, setPost] = useState<PostDetailData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<ReactionCounts>({ Interesante: 0, Util: 0, Cientifico: 0 });
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [postRes, commentsRes, reactionsRes] = await Promise.all([
        fetch(`/api/posts/${id}`),
        fetch(`/api/posts/${id}/comments`),
        fetch(`/api/posts/${id}/reactions`),
      ]);

      if (!postRes.ok) throw new Error('No se encontró la publicación');

      const [postData, commentsData, reactionsData] = await Promise.all([
        postRes.json(),
        commentsRes.ok ? commentsRes.json() : { comments: [] },
        reactionsRes.ok ? reactionsRes.json() : { reactions: {}, userReaction: null },
      ]);

      setPost(postData.post ?? postData);
      setComments(commentsData.comments ?? []);
      setReactions(reactionsData.reactions ?? { Interesante: 0, Util: 0, Cientifico: 0 });
      setUserReaction(reactionsData.userReaction ?? null);
      setIsSubscribed(reactionsData.isSubscribed ?? false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCommentDeleted = (deletedId: number) => {
    setComments((prev) => prev.filter((c) => c.id !== deletedId));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div className="h-8 w-32 bg-white/[0.04] rounded-lg animate-pulse" />
        <div className="h-64 bg-white/[0.04] rounded-2xl animate-pulse" />
        <div className="h-40 bg-white/[0.04] rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">{error ?? 'Publicación no encontrada'}</p>
          <button
            onClick={() => router.push('/community')}
            className="text-lime-400 hover:underline text-sm font-medium"
          >
            Volver a la comunidad
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push('/community')}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-lime-400 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la comunidad
      </button>

      {/* Post */}
      <PostDetail
        post={post}
        reactions={reactions}
        userReaction={userReaction}
        isSubscribed={isSubscribed}
      />

      {/* Comments */}
      <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-5">
          Comentarios ({comments.length})
        </h2>
        <CommentList
          comments={comments}
          onDelete={handleCommentDeleted}
        />

        {!post.isImmutable && (
          <div className="mt-6 pt-6 border-t border-white/[0.08]">
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">
              Dejá tu comentario
            </h3>
            <CommentForm postId={post.id} onComment={fetchAll} />
          </div>
        )}

        {post.isImmutable && (
          <p className="mt-4 text-sm text-zinc-600 text-center flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            Esta publicación está bloqueada. No se pueden agregar comentarios.
          </p>
        )}
      </section>
    </div>
  );
}
