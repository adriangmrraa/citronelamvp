'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  MessageSquare, 
  Wallet, 
  Ticket, 
  User
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useForum } from '@/hooks/useForum';

// Modular Components
import ProfileForumActivity from './ProfileForumActivity';
import ProfileWallet from './ProfileWallet';
import ProfileEvents from './ProfileEvents';
import ProfileAccount from './ProfileAccount';
import { EmptyState } from './EmptyState';

type MainTab = 'foro' | 'wallet' | 'events' | 'account';
type ForoSubTab = 'posts' | 'comments' | 'likes' | 'bookmarks';

interface UnifiedProfileClientProps {
  initialProfile: any;
  initialDocuments: any[];
}

export default function UnifiedProfileClient({ initialProfile, initialDocuments }: UnifiedProfileClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { 
    allPosts, 
    bookmarks, 
    toggleBookmark, 
    isPostBookmarked,
    toggleLikePost,
    deletePost
  } = useForum();

  // State management for tabs
  const [activeTab, setActiveTab] = useState<MainTab>('foro');
  const [foroTab, setForoTab] = useState<ForoSubTab>('posts');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as MainTab;
    if (tabParam && ['foro', 'wallet', 'events', 'account'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    const subTabParam = searchParams.get('sub') as ForoSubTab;
    if (subTabParam && ['posts', 'comments', 'likes', 'bookmarks'].includes(subTabParam)) {
      setForoTab(subTabParam);
    }
  }, [searchParams]);

  // Derived data for forum (with defensive checks)
  const safePosts = Array.isArray(allPosts) ? allPosts : [];
  const userPosts = safePosts.filter(p => p?.author?.name === user?.name);
  const likedPosts = safePosts.filter(p => (p?.stats?.likes || 0) > 0);
  const savedPosts = safePosts.filter(p => (bookmarks || []).includes(p?.id));
  const userComments = safePosts.filter(p => p?.comments?.some(c => c?.author?.name === user?.name))
    .flatMap(p => (p?.comments || []).filter(c => c?.author?.name === user?.name).map(c => ({ ...c, postTitle: p?.title, postId: p?.id })));

  if (!mounted) return null;

  const handlePostClick = (post: any) => {
    router.push(`/foro/${post.id}`);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Premium Header */}
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-lime-400/20 to-[#07120b]" />
        <div className="absolute inset-0 bg-[url('/images/bg/grid.png')] opacity-20" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col md:flex-row items-end gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-[#1a1a1a] border-2 border-white/10 overflow-hidden">
              <img 
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1 mb-2">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                {user.name}
              </h1>
              {user.role === 'admin' && (
                <div className="bg-lime-400 text-[#07120b] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                  ADMIN
                </div>
              )}
            </div>
            <p className="text-zinc-400 text-sm font-medium tracking-wide">
              {user.email || 'Miembro de Citronela'}
            </p>
          </div>

          <div className="flex gap-4 mb-2">
            <div className="text-center px-4">
              <p className="text-2xl font-black text-white leading-none">{userPosts.length}</p>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] mb-8 w-full lg:w-fit">
          {[
            { id: 'foro', label: 'Foro', icon: MessageSquare },
            { id: 'wallet', label: 'Billetera', icon: Wallet },
            { id: 'events', label: 'Eventos', icon: Ticket },
            { id: 'account', label: 'Mi Cuenta', icon: User },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MainTab)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                activeTab === tab.id 
                  ? 'bg-lime-400 text-[#07120b] shadow-[0_0_20px_rgba(163,230,53,0.3)]' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 gap-8">
          {activeTab === 'foro' && (
            <ProfileForumActivity 
              foroTab={foroTab}
              setForoTab={setForoTab}
              userPosts={userPosts}
              userComments={userComments}
              likedPosts={likedPosts}
              savedPosts={savedPosts}
              handlePostClick={handlePostClick}
              toggleLikePost={toggleLikePost}
              deletePost={deletePost}
              toggleBookmark={toggleBookmark}
              isPostBookmarked={isPostBookmarked}
              router={router}
              EmptyState={EmptyState}
            />
          )}

          {activeTab === 'wallet' && (
            <ProfileWallet user={user} />
          )}

          {activeTab === 'events' && (
            <ProfileEvents user={user} router={router} EmptyState={EmptyState} />
          )}

          {activeTab === 'account' && (
            <ProfileAccount 
              user={user} 
              initialProfile={initialProfile} 
              initialDocuments={initialDocuments} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
