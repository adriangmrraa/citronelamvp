'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForum } from '@/hooks/useForum';
import ForumPostDetail from '@/components/foro/ForumPostDetail';

export default function PostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { 
    allPosts, 
    addComment, 
    toggleLikePost, 
    toggleLikeComment, 
    toggleBookmark,
    isPostBookmarked,
    deletePost, 
    isLoaded 
  } = useForum();

  if (!isLoaded) return <div className="min-h-screen bg-[#07120b]" />;

  const post = allPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#07120b] flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold text-zinc-100 mb-4">Post no encontrado</h1>
        <button 
          onClick={() => router.push('/foro')}
          className="text-lime-400 hover:underline"
        >
          Volver al foro
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07120b] pb-20">
      <ForumPostDetail 
        post={post} 
        onClose={() => router.push('/foro')}
        onAddComment={addComment}
        onLikePost={toggleLikePost}
        onLikeComment={toggleLikeComment}
        onDeletePost={deletePost}
        onToggleBookmark={toggleBookmark}
        isBookmarked={isPostBookmarked(post.id)}
        isStandalone={true}
      />
    </div>
  );
}
