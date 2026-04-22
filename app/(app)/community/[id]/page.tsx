'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error ?? 'Publicación no encontrada'}</p>
          <button
            onClick={() => router.push('/community')}
            className="text-green-600 hover:underline text-sm font-medium"
          >
            Volver a la comunidad
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Back */}
        <button
          onClick={() => router.push('/community')}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium"
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
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-5">
            Comentarios ({comments.length})
          </h2>
          <CommentList
            comments={comments}
            onDelete={handleCommentDeleted}
          />

          {!post.isImmutable && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Dejá tu comentario
              </h3>
              <CommentForm postId={post.id} onComment={fetchAll} />
            </div>
          )}

          {post.isImmutable && (
            <p className="mt-4 text-sm text-gray-400 dark:text-gray-500 text-center">
              🔒 Esta publicación está bloqueada. No se pueden agregar comentarios.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
