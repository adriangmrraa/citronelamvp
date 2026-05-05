'use client';

import { useState, useEffect, useRef } from 'react';
import { ForumPost, ForumComment } from '@/types/forum';
import { 
  X, Heart, MessageSquare, 
  ShieldAlert, ArrowLeft, MoreHorizontal,
  Bookmark, EyeOff, Reply, MinusCircle,
  Forward, Type, List, CornerDownRight, Table, Flag,
  Pencil, Pin, Trash2, AlertCircle
} from 'lucide-react';
import { formatTimeAgo, getTotalCommentsCount } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import ReportModal from './ReportModal';
import ImageLightbox from './ImageLightbox';
import { Search, ChevronDown, Layers } from 'lucide-react';

interface ForumPostDetailProps {
  post: ForumPost;
  onClose: () => void;
  onAddComment: (postId: string, content: string, authorName: string, parentId?: string) => void;
  onLikePost: (postId: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onDeletePost?: (postId: string) => void;
  onToggleBookmark?: (postId: string) => void;
  isBookmarked?: boolean;
  isStandalone?: boolean;
}

/**
 * REUSABLE COMMENT INPUT COMPONENT (Smart/Expandable Reddit Style)
 */
const CommentInput = ({ 
  replyToName, 
  onCancel, 
  onSubmit,
  isMain = false
}: { 
  replyToName?: string, 
  onCancel?: () => void, 
  onSubmit: (content: string) => void,
  isMain?: boolean
}) => {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
    setIsFocused(false);
  };

  const handleCancel = () => {
    setContent('');
    setIsFocused(false);
    if (onCancel) onCancel();
  };

  const isExpanded = isFocused || content.length > 0;

  if (!isExpanded && isMain) {
    return (
      <div 
        onClick={() => setIsFocused(true)}
        className="w-full bg-[#0a1a10] border border-white/10 rounded-full py-2 px-6 mb-8 cursor-text text-zinc-500 text-sm hover:border-white/20 transition-all flex items-center"
      >
        Únete a la conversación
      </div>
    );
  }

  return (
    <div className={`w-full bg-[#0a1a10] border rounded-3xl p-4 mb-4 transition-all duration-300 animate-fade-in ${
      isFocused 
        ? 'border-lime-400/40 shadow-[0_0_20px_rgba(163,230,53,0.08)] bg-[#0c2215]' 
        : 'border-white/10'
    }`}>
      {!isMain && replyToName && (
        <div className="text-[11px] text-zinc-500 mb-2 font-medium">
          Responder a <span className="text-lime-400">u/{replyToName}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="¿Qué estás pensando?"
          autoFocus={!isMain}
          className="w-full bg-transparent border-none text-zinc-100 text-sm focus:ring-0 outline-none resize-none min-h-[80px] placeholder:text-zinc-600 transition-all"
        />
        
        <div className="flex justify-end items-center mt-2">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={handleCancel}
              className="px-4 py-1.5 rounded-full text-xs font-bold text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={!content.trim()}
              className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all ${
                content.trim() 
                  ? 'bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:scale-105 active:scale-95' 
                  : 'bg-white/5 text-zinc-600 cursor-not-allowed'
              }`}
            >
              {isMain ? 'Comentar' : 'Responder'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default function ForumPostDetail({ 
  post, 
  onClose, 
  onAddComment, 
  onLikePost: propsOnLikePost, 
  onLikeComment: propsOnLikeComment,
  onToggleBookmark,
  isBookmarked = false,
  isStandalone = false
}: ForumPostDetailProps) {
  const [activeMenu, setActiveMenu] = useState<'post' | string | null>(null);
  const [isGlobalCollapsed, setIsGlobalCollapsed] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingTarget, setReportingTarget] = useState<{ name: string, id: string, type: 'post' | 'comment' } | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [commentSearch, setCommentSearch] = useState('');
  const [sortBy, setSortBy] = useState('Mejores');
  const router = useRouter();

  useEffect(() => {
    if (!isStandalone) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isStandalone]);

  const handleSave = () => {
    if (onToggleBookmark) {
      onToggleBookmark(post.id);
      setToastMessage(!isBookmarked ? "Publicación guardada" : "Removido de guardados");
      setTimeout(() => setToastMessage(null), 3000);
    }
    setActiveMenu(null);
  };

  const handleHide = () => {
    if (isStandalone) {
      router.push(`/foro?hiddenId=${post.id}`);
    } else {
      onClose();
    }
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: ForumComment, depth?: number }) => {
    const [localExpanded, setLocalExpanded] = useState<boolean | null>(null);
    const [isReplying, setIsReplying] = useState(false);
    const [isCommentLiked, setIsCommentLiked] = useState(false);
    const [commentLikesCount, setCommentLikesCount] = useState(comment.stats?.likes ?? 0);

    const handleCommentLike = () => {
      propsOnLikeComment(post.id, comment.id);
      setCommentLikesCount(prev => isCommentLiked ? prev - 1 : prev + 1);
      setIsCommentLiked(!isCommentLiked);
    };

    const isExpanded = localExpanded !== null ? localExpanded : !isGlobalCollapsed;
    const shouldShowReplies = isExpanded && comment.replies && comment.replies.length > 0;

    return (
      <div className={`relative ${depth > 0 ? 'ml-6 pl-4' : 'mt-10'}`}>
        <div className="flex gap-4 group relative py-2">
          {depth > 0 && (
            <div className="absolute left-[-12px] top-0 bottom-0 w-[1.5px] bg-white/[0.05] group-hover:bg-lime-400/20 transition-colors" />
          )}

          <div className="relative z-10 flex-shrink-0 flex flex-col items-center gap-2">
            <img 
              src={comment.author.avatar} 
              alt="" 
              className="w-8 h-8 rounded-full border border-white/10 bg-[#07120b]" 
            />
            
            {comment.replies && comment.replies.length > 0 && (
              <button 
                onClick={() => setLocalExpanded(!isExpanded)}
                className="flex items-center justify-center w-5 h-5 rounded-full border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 transition-all bg-white/5"
                title={isExpanded ? "Ocultar respuestas" : "Mostrar respuestas"}
              >
                <span className="text-sm font-bold leading-none translate-y-[-1px]">
                  {isExpanded ? '-' : '+'}
                </span>
              </button>
            )}
          </div>
          
          <div className="flex-1 py-0.5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-lime-400">{comment.author.name || 'Usuario'}</span>
                <span className="text-[10px] text-zinc-600 font-medium">
                  {formatTimeAgo(comment.createdAt)}
                </span>
              </div>
              
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === comment.id ? null : comment.id);
                  }}
                  className="p-1 text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  <MoreHorizontal size={18} />
                </button>
                
                {activeMenu === comment.id && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#050c07] border border-white/5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 py-1 overflow-hidden">
                    <button 
                      onClick={() => {
                        setLocalExpanded(false);
                        setActiveMenu(null);
                      }}
                      className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-medium text-zinc-300 hover:bg-white/5 transition-colors text-left border-b border-white/[0.03]"
                    >
                      <MinusCircle size={15} strokeWidth={1.5} /> Contraer hilo
                    </button>
                    <button className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-medium text-zinc-300 hover:bg-white/5 transition-colors text-left border-b border-white/[0.03]">
                      <Bookmark size={15} strokeWidth={1.5} /> Guardar
                    </button>
                    <button 
                      onClick={() => {
                        setReportingTarget({ name: comment.author.name, id: comment.id, type: 'comment' });
                        setIsReportModalOpen(true);
                        setActiveMenu(null);
                      }}
                      className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <ShieldAlert size={15} strokeWidth={2} /> Denunciar
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-zinc-300 leading-relaxed mb-3 pr-4">{comment.content}</p>
            
            <div className="flex items-center gap-4">
                <button 
                  onClick={handleCommentLike}
                  className={`flex items-center gap-1.5 transition-all duration-300 ${
                    isCommentLiked ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <Heart 
                    size={15} 
                    className={`transition-colors duration-300 ${isCommentLiked ? 'text-rose-500 fill-rose-500' : 'text-zinc-500'}`} 
                    strokeWidth={isCommentLiked ? 0 : 2} 
                  />
                  <span className={`text-[10px] font-bold transition-colors duration-300 ${isCommentLiked ? 'text-rose-500' : 'text-zinc-500'}`}>
                    {commentLikesCount}
                  </span>
                </button>

              <button 
                onClick={() => setIsReplying(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 transition-colors"
              >
                <Reply size={14} />
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Responder</span>
              </button>
            </div>
          </div>
        </div>

        {isReplying && (
          <div className="mt-2 ml-12">
            <CommentInput 
              replyToName={comment.author.name}
              onCancel={() => setIsReplying(false)}
              onSubmit={(content) => {
                onAddComment(post.id, content, 'Tú (Demo User)', comment.id);
                setIsReplying(false);
              }}
            />
          </div>
        )}

        {shouldShowReplies && (
          <div className="relative animate-fade-in">
            {comment.replies && comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const containerClasses = isStandalone
    ? "min-h-screen flex flex-col bg-[#07120b] w-full max-w-2xl mx-auto border-x border-white/5 relative shadow-2xl"
    : "fixed inset-0 z-[100] flex flex-col bg-[#07120b] lg:inset-y-0 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[450px] lg:border-x lg:border-white/10 shadow-2xl";

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.stats?.likes ?? 0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUnveiled, setIsUnveiled] = useState(false);
  const isOwnPost = post.author.name === "Usuario Citronela";

  const showNSFWCurtain = false;

  const onLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    propsOnLikePost(post.id);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className={containerClasses}>
      {showSavedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-lime-400 text-[#07120b] px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-tighter shadow-[0_10px_40px_rgba(163,230,53,0.3)] animate-in fade-in slide-in-from-top-4 duration-300">
          Publicación guardada
        </div>
      )}

      {/* Generic Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-lime-400 text-[#07120b] px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-tighter shadow-[0_10px_40px_rgba(163,230,53,0.3)] animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#07120b]">
        <div 
          className="absolute inset-0 z-0" 
          style={{
            background: `
              radial-gradient(circle at 0% 0%, rgba(163, 230, 53, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 100% 40%, rgba(163, 230, 53, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 15% 100%, rgba(163, 230, 53, 0.1) 0%, transparent 50%)
            `
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-[0.04] animate-bg-drift bg-cover bg-center grayscale contrast-125"
          style={{ backgroundImage: "url('/images/bg/hero.jpg')" }}
        />
        <div className="absolute inset-0 z-0 bg-grid-weed opacity-[0.03]" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 relative z-20" onClick={() => setActiveMenu(null)}>
        <button 
          onClick={onClose} 
          className="absolute top-4 left-4 z-50 p-2 bg-black/20 backdrop-blur-md rounded-full text-zinc-400 hover:text-white hover:bg-black/40 transition-all border border-white/10"
        >
          <X size={20} />
        </button>

        <div className="p-6 pt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img src={post.author.avatar} alt="" className="w-12 h-12 rounded-full border border-lime-400/20 shadow-glow-lime/20" />
              <div>
                <h3 className="font-bold text-zinc-100">{post.author.name}</h3>
                <p className="text-xs text-zinc-500 font-medium">{post.author.role} • {formatTimeAgo(post.createdAt)}</p>
              </div>
            </div>

            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu(activeMenu === 'post' ? null : 'post');
                }}
                className="p-2 text-zinc-400 hover:text-zinc-100 bg-white/5 rounded-full transition-colors"
              >
                <MoreHorizontal size={24} />
              </button>

              {activeMenu === 'post' && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#050c07] border border-white/5 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200 py-1 overflow-hidden">
                  {isOwnPost ? (
                    <>
                      <button 
                        onClick={() => { router.push(`/foro/editar/${post.id}`); setActiveMenu(null); }}
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
                        onClick={() => { setToastMessage("Publicación fijada en tu perfil"); setActiveMenu(null); setTimeout(() => setToastMessage(null), 3000); }}
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
                        onClick={() => {
                          if (onDeletePost) onDeletePost(post.id);
                          setToastMessage("Publicación eliminada");
                          setActiveMenu(null);
                          setTimeout(() => {
                            setToastMessage(null);
                            onClose();
                          }, 1500);
                        }}
                        className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <Trash2 size={15} strokeWidth={2} /> Eliminar
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => {
                          setIsGlobalCollapsed(!isGlobalCollapsed);
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-medium text-zinc-300 hover:bg-white/5 transition-colors text-left border-b border-white/[0.03]"
                      >
                        <MinusCircle size={15} strokeWidth={1.5} /> {isGlobalCollapsed ? 'Expandir hilos' : 'Contraer hilo'}
                      </button>
                      <button 
                        onClick={handleSave}
                        className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-medium text-zinc-300 hover:bg-white/5 transition-colors text-left border-b border-white/[0.03]"
                      >
                        <Bookmark size={15} strokeWidth={1.5} /> Guardar
                      </button>
                      <button 
                        onClick={handleHide}
                        className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-medium text-zinc-300 hover:bg-white/5 transition-colors text-left border-b border-white/[0.03]"
                      >
                        <EyeOff size={15} strokeWidth={1.5} /> Ocultar
                      </button>
                      <button 
                        onClick={() => {
                          setReportingTarget({ name: post.author.name, id: post.id, type: 'post' });
                          setIsReportModalOpen(true);
                          setActiveMenu(null);
                        }}
                className="w-full flex items-center gap-3.5 px-4 py-3 text-[11px] font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <ShieldAlert size={15} strokeWidth={2} /> Denunciar
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>


          <div className="relative">
            <div className={`transition-all duration-700 ${showNSFWCurtain ? 'blur-3xl opacity-10 pointer-events-none' : 'blur-0 opacity-100'}`}>
              <h1 className="text-3xl font-black text-zinc-100 mb-6 leading-[1.1] tracking-tighter">{post.title}</h1>

              <div className="text-zinc-400 text-base leading-relaxed space-y-4 mb-10">
                {post.content.split('\n').map((para, i) => <p key={i}>{para}</p>)}
              </div>

              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-1 gap-4 mb-10">
                  {post.images.map((img, idx) => (
                    <div 
                      key={idx}
                      className="group/img relative w-full overflow-hidden border border-white/5 cursor-zoom-in"
                      onClick={() => {
                        setLightboxIndex(idx);
                        setIsLightboxOpen(true);
                      }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out" />
                      <div className="absolute inset-0 bg-lime-400/0 group-hover/img:bg-lime-400/5 transition-colors duration-300" />
                      
                      {post.images!.length > 1 && (
                        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                          <Layers size={14} className="text-lime-400" />
                          <span className="text-[10px] font-black text-white">{idx + 1} / {post.images!.length}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showNSFWCurtain && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-30 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-rose-600/20 rounded-full flex items-center justify-center mb-4 border border-rose-600/30">
                  <ShieldAlert size={32} className="text-rose-500" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Contenido 18+</h4>
                <p className="text-xs text-zinc-500 mb-6 text-center max-w-[200px]">Este post contiene material para adultos.</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsUnveiled(true); }}
                  className="bg-white text-black px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-tighter hover:bg-lime-400 transition-colors shadow-xl"
                >
                  Ver contenido
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-8">
            <div className="flex items-center gap-6">
              <button 
                onClick={onLikePost}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  isLiked ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                <Heart 
                  size={20} 
                  className={`transition-colors duration-300 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-zinc-500'}`} 
                  strokeWidth={isLiked ? 0 : 2} 
                />
                <span className={`text-sm font-bold transition-colors duration-300 ${isLiked ? 'text-rose-500' : 'text-zinc-500'}`}>
                  {likesCount}
                </span>
              </button>
              <div className="flex items-center gap-2 text-zinc-500">
                <MessageSquare size={20} />
                <span className="text-sm font-bold">{getTotalCommentsCount(post.comments)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleSave}
              className={`flex items-center gap-2 transition-all duration-300 ${isBookmarked ? 'text-lime-400 scale-110' : 'text-zinc-500 hover:text-white'}`}
            >
              <Bookmark 
                size={20} 
                className={`transition-all duration-300 ${isBookmarked ? 'fill-lime-400' : ''}`}
                strokeWidth={isBookmarked ? 0 : 2}
              />
              <span className="text-sm font-bold">{isBookmarked ? 'Guardado' : 'Guardar'}</span>
            </button>
          </div>

          <CommentInput 
            isMain 
            onSubmit={(content) => onAddComment(post.id, content, 'Tú (Demo User)')} 
          />

          {/* Filters and Search */}
          <div className="flex items-center justify-between mt-8 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-bold">Ordenar por:</span>
              <button 
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/5 rounded-lg text-zinc-300 transition-colors"
                onClick={() => setSortBy(sortBy === 'Mejores' ? 'Nuevos' : 'Mejores')}
              >
                <span className="text-xs font-black">{sortBy}</span>
                <ChevronDown size={14} className="text-zinc-500" />
              </button>
            </div>

            <div className="relative group flex-1 max-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-lime-400 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Buscar comentarios"
                value={commentSearch}
                onChange={(e) => setCommentSearch(e.target.value)}
                className="w-full bg-[#0a1a10] border border-white/10 rounded-full py-2 pl-9 pr-4 text-[11px] text-zinc-300 focus:outline-none focus:border-lime-400/40 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 opacity-50">
              {commentSearch.trim() 
                ? `Resultados de búsqueda (${post.comments.filter(c => 
                    c.content.toLowerCase().includes(commentSearch.toLowerCase()) || 
                    c.author.name.toLowerCase().includes(commentSearch.toLowerCase())
                  ).length})`
                : `Discusión (${getTotalCommentsCount(post.comments)})`
              }
            </h4>
            {post.comments.length === 0 ? (
              <p className="text-zinc-600 text-sm italic">Nadie ha comentado aún.</p>
            ) : (
              <div className="space-y-0">
                {post.comments
                  .filter(comment => {
                    if (!commentSearch.trim()) return true;
                    const searchLower = commentSearch.toLowerCase();
                    return (
                      comment.content.toLowerCase().includes(searchLower) ||
                      comment.author.name.toLowerCase().includes(searchLower)
                    );
                  })
                  .sort((a, b) => {
                    if (sortBy === 'Mejores') {
                      return (b.stats?.likes ?? 0) - (a.stats?.likes ?? 0);
                    } else {
                      // Ordenar por fecha (más reciente primero)
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    }
                  })
                  .map(comment => <CommentItem key={comment.id} comment={comment} />)
                }
                {commentSearch.trim() && post.comments.filter(c => 
                  c.content.toLowerCase().includes(commentSearch.toLowerCase()) || 
                  c.author.name.toLowerCase().includes(commentSearch.toLowerCase())
                ).length === 0 && (
                  <p className="text-zinc-500 text-sm italic py-10 text-center">No se encontraron comentarios que coincidan con tu búsqueda.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        authorName={reportingTarget?.name}
        onBlockAction={reportingTarget?.type === 'post' ? handleHide : undefined}
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
