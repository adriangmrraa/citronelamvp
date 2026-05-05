'use client';

import { useSearchParams } from 'next/navigation';
import { ForumPost } from '@/types/forum';
import ForumPostCard from './ForumPostCard';

interface ForumFeedProps {
  posts: ForumPost[];
  onPostClick: (post: ForumPost) => void;
  onLikePost: (e: React.MouseEvent, postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onToggleBookmark?: (postId: string) => void;
  isPostBookmarked?: (postId: string) => boolean;
}

export default function ForumFeed({ 
  posts, 
  onPostClick, 
  onLikePost, 
  onDeletePost,
  onToggleBookmark,
  isPostBookmarked
}: ForumFeedProps) {
  const searchParams = useSearchParams();
  const hiddenId = searchParams.get('hiddenId');

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
          <span className="material-symbols-outlined text-zinc-600 text-3xl">search_off</span>
        </div>
        <h3 className="text-zinc-400 font-bold">No se encontraron semillas de discusión</h3>
        <p className="text-zinc-600 text-sm mt-1">Prueba con otros términos o categorías</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {posts.map((post) => (
        <ForumPostCard 
          key={post.id} 
          post={post} 
          onClick={onPostClick}
          onLike={onLikePost}
          onDelete={onDeletePost}
          onToggleBookmark={onToggleBookmark}
          isBookmarked={isPostBookmarked ? isPostBookmarked(post.id) : false}
          initialHidden={post.id === hiddenId}
        />
      ))}
    </div>
  );
}
