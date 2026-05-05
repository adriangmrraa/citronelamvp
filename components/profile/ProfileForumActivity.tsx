'use client';

import React from 'react';
import { MessageSquare, LayoutGrid, Heart, Bookmark } from 'lucide-react';
import ForumFeed from '@/components/foro/ForumFeed';

interface ProfileForumActivityProps {
  foroTab: 'posts' | 'comments' | 'likes' | 'bookmarks';
  setForoTab: (tab: 'posts' | 'comments' | 'likes' | 'bookmarks') => void;
  userPosts: any[];
  userComments: any[];
  likedPosts: any[];
  savedPosts: any[];
  handlePostClick: (post: any) => void;
  toggleLikePost: (id: string) => void;
  deletePost: (id: string) => void;
  toggleBookmark: (id: string) => void;
  isPostBookmarked: (id: string) => boolean;
  router: any;
  EmptyState: React.FC<any>;
}

export default function ProfileForumActivity({
  foroTab,
  setForoTab,
  userPosts,
  userComments,
  likedPosts,
  savedPosts,
  handlePostClick,
  toggleLikePost,
  deletePost,
  toggleBookmark,
  isPostBookmarked,
  router,
  EmptyState
}: ProfileForumActivityProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Foro Sub-tabs */}
      <div className="flex gap-4 border-b border-white/5 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'posts', label: 'Mis Posts' },
          { id: 'comments', label: 'Comentarios' },
          { id: 'likes', label: 'Likes' },
          { id: 'bookmarks', label: 'Guardados' },
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setForoTab(sub.id as any)}
            className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 transition-all relative ${
              foroTab === sub.id ? 'text-lime-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {sub.label}
            {foroTab === sub.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-lime-400" />}
          </button>
        ))}
      </div>

      {foroTab === 'posts' && (
        userPosts.length > 0 ? (
          <ForumFeed 
            posts={userPosts}
            onPostClick={handlePostClick}
            onLikePost={toggleLikePost}
            onDeletePost={deletePost}
            onToggleBookmark={toggleBookmark}
            isPostBookmarked={isPostBookmarked}
          />
        ) : (
          <EmptyState icon={LayoutGrid} title="Sin publicaciones" description="Todavía no compartiste nada en la comunidad." />
        )
      )}

      {foroTab === 'comments' && (
        userComments.length > 0 ? (
          <div className="space-y-4">
            {userComments.map((comment: any, idx: number) => (
              <div 
                key={idx}
                onClick={() => router.push(`/foro/${comment.postId}`)}
                className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] hover:border-lime-400/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={14} className="text-lime-400" />
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">En post: {comment.postTitle}</p>
                </div>
                <p className="text-zinc-200 text-sm font-medium">{comment.content}</p>
                <p className="mt-3 text-[9px] text-zinc-600 font-black uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={MessageSquare} title="Sin comentarios" description="Tus opiniones y respuestas aparecerán aquí." />
        )
      )}

      {foroTab === 'likes' && (
        likedPosts.length > 0 ? (
          <ForumFeed 
            posts={likedPosts}
            onPostClick={handlePostClick}
            onLikePost={toggleLikePost}
            onDeletePost={deletePost}
            onToggleBookmark={toggleBookmark}
            isPostBookmarked={isPostBookmarked}
          />
        ) : (
          <EmptyState icon={Heart} title="Sin likes" description="Los posts que te gusten se guardarán acá." />
        )
      )}

      {foroTab === 'bookmarks' && (
        savedPosts.length > 0 ? (
          <ForumFeed 
            posts={savedPosts}
            onPostClick={handlePostClick}
            onLikePost={toggleLikePost}
            onDeletePost={deletePost}
            onToggleBookmark={toggleBookmark}
            isPostBookmarked={isPostBookmarked}
          />
        ) : (
          <EmptyState icon={Bookmark} title="Sin guardados" description="Guardá posts para leerlos con más tiempo." />
        )
      )}
    </div>
  );
}
