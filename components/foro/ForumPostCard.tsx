'use client';

import { useState } from 'react';
import { ForumPost } from '@/types/forum';
import { 
  MessageSquare, Heart, Eye, Share2, MoreHorizontal, 
  Bell, Bookmark, EyeOff, ShieldAlert, MinusCircle,
  Pencil, Pin, Trash2, AlertCircle, ChevronLeft, ChevronRight, Layers
} from 'lucide-react';
import { formatTimeAgo, getTotalCommentsCount } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import ReportModal from './ReportModal';
import ImageLightbox from './ImageLightbox';

interface ForumPostCardProps {
  post: ForumPost;
  onClick: (post: ForumPost) => void;
  onLike: (e: React.MouseEvent, postId: string) => void;
  onDelete?: (postId: string) => void;
  onToggleBookmark?: (postId: string) => void;
  isBookmarked?: boolean;
  initialHidden?: boolean;
}

export default function ForumPostCard({ 
  post, 
  onClick, 
  onLike, 
  onDelete,
  onToggleBookmark,
  isBookmarked = false,
  initialHidden = false 
}: ForumPostCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isUnveiled, setIsUnveiled] = useState(false);
  const [isHidden, setIsHidden] = useState(initialHidden);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.stats?.likes ?? 0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const router = useRouter();

  // Mock current user check
  const CURRENT_USER_NAME = "Usuario Citronela";
  const isOwnPost = post.author.name === CURRENT_USER_NAME;

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleUnveil = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUnveiled(true);
  };

  const handleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHidden(true);
    setShowMenu(false);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(post.id);
      showToast(!isBookmarked ? "Publicación guardada" : "Removido de guardados");
    }
    setShowMenu(false);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = (e: React.MouseEvent, message: string) => {
    e.stopPropagation();
    showToast(message);
    setShowMenu(false);
  };

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
    }
    onLike(e, post.id);
  };

  const showNSFWCurtain = false;

  if (isHidden) {
    return (
      <div className="w-full py-4 px-6 bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-between animate-fade-in mb-1">
        <span className="text-xs text-zinc-500 font-medium tracking-wide">Publicación ocultada</span>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsHidden(false); }}
          className="text-[10px] font-bold text-lime-400 hover:underline uppercase tracking-widest"
        >
          Deshacer
        </button>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(post)}
      className={`group bg-white/[0.03] border border-white/5 rounded-none hover:border-lime-400/30 transition-all cursor-pointer animate-fade-in relative ${showMenu ? 'z-[110]' : 'z-0'}`}
    >
      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-lime-400 text-[#07120b] px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-tighter shadow-[0_10px_40px_rgba(163,230,53,0.3)] animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}

      <div className="p-5">
        {/* Top Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-8 h-8 rounded-full border border-white/10"
            />
            <div>
              <div className="text-sm font-bold text-white tracking-tight">{post.author.name}</div>
              <div className="text-[10px] text-zinc-500 font-medium tracking-wide">
                {formatTimeAgo(post.createdAt)} • {post.category}
              </div>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={handleMenuClick}
              className={`p-2 rounded-full transition-all duration-300 ${showMenu ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              <MoreHorizontal size={18} />
            </button>

            {/* Post Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#050c07] border border-white/10 rounded-2xl shadow-2xl z-[100] py-2 animate-in fade-in zoom-in-95 duration-200">
                {!isOwnPost ? (
                  <>
                    <button 
                      onClick={handleSave}
                      className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-medium text-zinc-300 hover:bg-white/5 transition-colors text-left border-b border-white/[0.03]"
                    >
                      <Bookmark size={15} strokeWidth={2} /> Guardar publicación
                    </button>
                    <button className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-medium text-zinc-300 hover:bg-white/5 transition-colors text-left border-b border-white/[0.03]">
                      <Bell size={15} strokeWidth={1.5} /> Recibir notificaciones
                    </button>
                    <button 
                      onClick={handleHide}
                      className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-medium text-zinc-300 hover:bg-white/5 transition-colors text-left border-b border-white/[0.03]"
                    >
                      <EyeOff size={15} strokeWidth={1.5} /> Ocultar
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsReportModalOpen(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <ShieldAlert size={15} strokeWidth={2} /> Denunciar
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/foro/editar/${post.id}`);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-medium text-zinc-300 hover:bg-white/5 transition-colors text-left border-b border-white/[0.03]"
                    >
                      <Pencil size={15} strokeWidth={1.5} /> Editar cuerpo de la publicación
                    </button>
                    <button 
                      onClick={handleSave}
                      className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-medium text-zinc-300 hover:bg-white/5 transition-colors text-left border-b border-white/[0.03]"
                    >
                      <Bookmark size={15} strokeWidth={1.5} /> Guardar
                    </button>
                    <button 
                      onClick={(e) => handleAction(e, "Publicación fijada en tu perfil")}
                      className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-medium text-lime-400 hover:bg-lime-400/5 transition-colors text-left border-b border-white/[0.03]"
                    >
                      <Pin size={15} strokeWidth={2} /> Fijar publicación al perfil
                    </button>
                    <button 
                      onClick={handleHide}
                      className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-medium text-zinc-300 hover:bg-white/5 transition-colors text-left border-b border-white/[0.03]"
                    >
                      <EyeOff size={15} strokeWidth={1.5} /> Ocultar
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDelete) onDelete(post.id);
                        setShowMenu(false);
                        showToast("Publicación eliminada");
                      }}
                      className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <Trash2 size={15} strokeWidth={2} /> Eliminar
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>


        {/* Content Section */}
        <div className="relative">
          <div className={`transition-all duration-700 ${showNSFWCurtain ? 'blur-3xl opacity-10 pointer-events-none' : 'blur-0 opacity-100'}`}>
            <h3 className="text-lg font-black text-white group-hover:text-[#A3E635] transition-colors leading-tight mb-2 tracking-tighter">
              {post.title}
            </h3>
            
            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 mb-4">
              {post.content}
            </p>

            {post.images && post.images.length > 0 && (
              <div 
                className="group/img relative aspect-video w-full mb-4 overflow-hidden border border-white/5 cursor-zoom-in"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(0);
                  setIsLightboxOpen(true);
                }}
              >
                <img 
                  src={post.images[0]} 
                  alt="" 
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                />
                
                {post.images.length > 1 && (
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg flex items-center gap-1.5 animate-in slide-in-from-bottom-2 duration-300">
                    <Layers size={12} className="text-lime-400" />
                    <span className="text-[10px] font-black text-white">1 / {post.images.length}</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-lime-400/0 group-hover/img:bg-lime-400/5 transition-colors duration-300" />
              </div>
            )}
          </div>

          {showNSFWCurtain && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button 
                onClick={handleUnveil}
                className="px-6 py-2.5 rounded-full border border-white/20 bg-black/40 text-white font-bold text-sm hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-xl animate-in zoom-in-95 duration-300 active:scale-95"
              >
                Ver contenido 18+
              </button>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLikeToggle}
              className={`flex items-center gap-1.5 transition-all duration-300 ${isLiked ? 'scale-110' : 'hover:scale-105'}`}
            >
              <Heart 
                size={18} 
                className={`transition-colors duration-300 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-zinc-500'}`} 
                strokeWidth={isLiked ? 0 : 2} 
              />
              <span className={`text-xs font-bold transition-colors duration-300 ${isLiked ? 'text-rose-500' : 'text-zinc-500'}`}>
                {likesCount}
              </span>
            </button>
            <div className="flex items-center gap-1.5 text-zinc-500">
              <MessageSquare size={18} />
              <span className="text-xs font-bold">{getTotalCommentsCount(post.comments)}</span>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className={`flex items-center gap-1.5 transition-all duration-300 ${isBookmarked ? 'text-lime-400 scale-110' : 'text-zinc-500 hover:text-white'}`}
          >
            <Bookmark 
              size={18} 
              className={`transition-all duration-300 ${isBookmarked ? 'fill-lime-400' : ''}`}
              strokeWidth={isBookmarked ? 0 : 2}
            />
          </button>
        </div>
      </div>

      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        targetName={post.title}
        authorName={post.author.name}
        onBlockAction={() => setIsHidden(true)}
      />

      {isLightboxOpen && post.images && (
        <ImageLightbox 
          images={post.images}
          initialIndex={lightboxIndex}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}
