'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForum } from '@/hooks/useForum';
import { Plus } from 'lucide-react';
import { ForumCarousel } from '@/components/features/foro/ForumCarousel';
import CategoryFilter from '@/components/foro/CategoryFilter';
import ForumFeed from '@/components/foro/ForumFeed';
import CommunityHeader from '@/components/foro/CommunityHeader';
import { COMMUNITIES } from '@/constants/communities';
import { useUserContext } from '@/context/UserContext';
import { useSearch } from '@/context/SearchContext';

export default function ForoPage() {
  const { username, tokens } = useUserContext();
  const { 
    posts, 
    allPosts,
    filter, 
    setFilter, 
    addPost, 
    deletePost,
    toggleLikePost, 
    toggleBookmark,
    isPostBookmarked,
    isLoaded 
  } = useForum();

  const router = useRouter();
  const { searchTerm } = useSearch();

  const handlePostClick = (post: any) => {
    router.push(`/foro/${post.id}`);
  };

  const handleLikePost = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    toggleLikePost(postId);
  };

  // Search logic
  const searchResults = allPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayPosts = searchTerm ? searchResults : posts;

  if (!isLoaded) return <div className="min-h-screen bg-[#07120b]" />;

  // Main Content Area
  const renderContent = () => {
    if (filter === 'Perfil') {
      return (
        <div className="min-h-[500px] flex flex-col items-center justify-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
          <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center border border-[#A3E635]/20 shadow-[0_0_30px_rgba(163,230,53,0.1)]">
            <span className="material-symbols-outlined text-[40px] text-[#A3E635] animate-pulse">
              construction
            </span>
          </div>
          
          <div className="text-center space-y-2">
            <h3 
              style={{ fontFamily: 'var(--font-avigea)' }}
              className="text-2xl text-white uppercase tracking-tighter"
            >
              Perfil en mantenimiento
            </h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto font-medium leading-relaxed">
              Estamos construyendo tu nuevo centro de identidad dentro del foro. 
              <span className="block mt-2 text-[#A3E635]/60 text-[10px] font-black uppercase tracking-widest italic">Roadmap 2026 - Conexión Social</span>
            </p>
          </div>

          <div className="pt-8 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#A3E635]/20 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="container max-w-2xl mx-auto px-4 py-0">
        <div className="mt-4" />
        
        <div className="mt-8 pb-24">
          <ForumFeed 
            posts={displayPosts}
            onPostClick={handlePostClick} 
            onLikePost={handleLikePost}
            onDeletePost={deletePost}
            onToggleBookmark={toggleBookmark}
            isPostBookmarked={isPostBookmarked}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative text-zinc-200">
      <div className="relative z-30">
        <div className="bg-[#A3E635] pt-3 pb-1 px-6 md:px-12 border-b border-[#07120b]/5">
          <div className="max-w-[2000px] mx-auto">
            <header className="flex items-center w-full relative z-50 h-[46px] px-0.5 gap-2">
              <div className="flex flex-shrink-0">
                <h1 
                  style={{ fontFamily: 'var(--font-avigea)' }}
                  className="text-sm sm:text-base tracking-tight"
                >
                  <span className="text-[#07120b]">Hola, </span>
                  <span className="text-white">{username}!</span>
                </h1>
              </div>

              <div className="flex-1 flex items-center justify-end gap-3">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#07120b] shadow-lg shadow-black/20 border border-white/5">
                  <span className="text-lg font-black text-white tracking-tight leading-none">
                    {tokens.toLocaleString()} <span className="text-[#A3E635] text-[10px] ml-1">TOKENS</span>
                  </span>
                </div>

                <button 
                  onClick={() => router.push('/foro/nuevo')}
                  className="w-12 h-12 bg-[#07120b] border-2 border-[#07120b] rounded-full flex items-center justify-center text-[#A3E635] shadow-lg shadow-black/20 hover:bg-black hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  <Plus size={24} />
                </button>
              </div>
            </header>

            <div className="mt-1">
              <CategoryFilter 
                currentCategory={filter} 
                onCategoryChange={setFilter} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-[86px] left-0 right-0 h-96 bg-gradient-to-b from-[#A3E635] via-[#A3E635]/20 to-transparent pointer-events-none z-10" />

      <div className="relative z-20">
        {filter !== 'Perfil' && (
          <div className="w-full py-0">
            {filter === 'Todo' ? (
              <ForumCarousel />
            ) : (
              <CommunityHeader community={COMMUNITIES[filter]} />
            )}
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
}
