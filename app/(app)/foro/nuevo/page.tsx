'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForum } from '@/hooks/useForum';
import { 
  X, 
  ChevronDown, 
  ImageIcon, 
  Type, 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered,
  MoreHorizontal,
  AlertCircle,
  ShieldAlert,
  AlertTriangle,
  EyeOff,
  CornerDownRight,
  Upload,
  Image as LucideImage,
  Trash2,
  Table
} from 'lucide-react';
import { ForumCategory } from '@/types/forum';

const categories: ForumCategory[] = ['Investigación', 'Papers', 'Debate', 'Anuncio'];

export default function NewPostPage() {
  const router = useRouter();
  const { addPost } = useForum();
  
  const [activeTab, setActiveTab] = useState<'texto' | 'multimedia'>('texto');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ForumCategory>('Debate');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = textareaRef.current.value;
    const beforeText = text.substring(0, start);
    const selectedText = text.substring(start, end);
    const afterText = text.substring(end);

    const newContent = beforeText + before + selectedText + after + afterText;
    setContent(newContent);
    setShowMoreMenu(false);
    
    // Set focus back and adjust cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + before.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos + selectedText.length);
      }
    }, 10);
  };

  const handlePublish = () => {
    if (!title.trim()) return;
    
    addPost({
      title,
      content,
      category,
      isNSFW: false,
      images: images,
      author: {
        name: 'Usuario Citronela',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citronela',
        role: 'User'
      }
    });
    
    router.push('/foro');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      
      for (const file of Array.from(files)) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newImages.push(base64);
      }
      
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };


  return (
    <div className="min-h-screen bg-black/40 backdrop-blur-sm text-zinc-200">
      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Publicar</h1>
          <div className="flex items-center gap-6">
            <button className="text-sm font-semibold text-[#A3E635] hover:opacity-80 transition-opacity">
              Borradores
            </button>
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Community Selector */}
        <div className="relative mb-6">
          <button 
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 rounded-full px-4 py-2 text-sm font-medium hover:border-white/20 transition-all"
          >
            <span className="text-white/60">Seleccionar comunidad:</span>
            <span className="text-[#A3E635]">{category}</span>
            <ChevronDown size={16} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCategoryOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setIsCategoryOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-6">
          <button 
            onClick={() => setActiveTab('texto')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all relative ${
              activeTab === 'texto' ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <Type size={18} />
            Texto
            {activeTab === 'texto' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#A3E635] rounded-t-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('multimedia')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all relative ${
              activeTab === 'multimedia' ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <ImageIcon size={18} />
            Multimedia
            {activeTab === 'multimedia' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#A3E635] rounded-t-full" />
            )}
          </button>
        </div>

        {/* Form Area */}
        <div className="space-y-4">
          {/* Title Input */}
          <div className="relative group">
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 300))}
              placeholder="Título*"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#A3E635]/50 transition-all"
            />
            <div className="absolute bottom-4 right-4 text-[10px] text-white/30 font-mono">
              {title.length}/300
            </div>
          </div>


          {/* Dynamic Content Area based on Tabs          {/* Content Area */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl focus-within:border-[#A3E635]/50 transition-all relative">
            {/* Conditional Multimedia Area (ONLY for multimedia tab) */}
            {activeTab === 'multimedia' && (
              <div className="p-4 border-b border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[#A3E635]'); }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-[#A3E635]'); }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-[#A3E635]');
                    const files = e.dataTransfer.files;
                    if (files && files.length > 0) {
                      const newImages: string[] = [];
                      for (const file of Array.from(files)) {
                        const base64 = await new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => resolve(reader.result as string);
                          reader.readAsDataURL(file);
                        });
                        newImages.push(base64);
                      }
                      setImages(prev => [...prev, ...newImages]);
                    }
                  }}
                  className="w-full aspect-[2.5/1] bg-white/[0.02] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#A3E635] group-hover:bg-white/10 transition-all">
                    <Upload size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-white">Añadir imágenes</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Arrastra o haz click</p>
                  </div>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((url, idx) => (
                      <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden group/img border border-white/10">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                          className="absolute top-1 right-1 p-1 bg-black/60 backdrop-blur-md rounded-full text-white/60 hover:text-rose-500 transition-colors opacity-0 group-hover/img:opacity-100"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 flex-shrink-0 bg-white/5 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center gap-1 text-white/20 hover:text-[#A3E635] hover:bg-white/10 transition-all"
                    >
                      <LucideImage size={16} />
                      <span className="text-[8px] font-bold uppercase tracking-tighter">Más</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Always Visible Toolbar (common for both) */}
            <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-white/[0.02] rounded-t-xl">
              <button onClick={() => insertText('**', '**')} className="p-2 hover:bg-white/5 rounded transition-colors text-white/60 hover:text-white"><Bold size={16} /></button>
              <button onClick={() => insertText('*', '*')} className="p-2 hover:bg-white/5 rounded transition-colors text-white/60 hover:text-white"><Italic size={16} /></button>
              <button onClick={() => insertText('~~', '~~')} className="p-2 hover:bg-white/5 rounded transition-colors text-white/60 hover:text-white"><Strikethrough size={16} /></button>
              <div className="w-[1px] h-4 bg-white/10 mx-1" />
              <button onClick={() => insertText('\n- ')} className="p-2 hover:bg-white/5 rounded transition-colors text-white/60 hover:text-white"><List size={16} /></button>
              <button onClick={() => insertText('\n1. ')} className="p-2 hover:bg-white/5 rounded transition-colors text-white/60 hover:text-white"><ListOrdered size={16} /></button>
              <div className="flex-1" />
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMoreMenu(!showMoreMenu);
                  }}
                  className={`p-2 rounded transition-colors ${showMoreMenu ? 'bg-[#A3E635] text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                  <MoreHorizontal size={16} />
                </button>
                
                {showMoreMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowMoreMenu(false)}
                    />
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-[0_10px_40_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 backdrop-blur-md">
                      <button type="button" onClick={() => insertText('> ')} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-zinc-300 hover:bg-[#A3E635] hover:text-black transition-colors text-left border-b border-white/5 group">
                        <CornerDownRight size={14} className="text-zinc-500 group-hover:text-black transition-colors" /> Bloque de cita
                      </button>
                      <button type="button" onClick={() => insertText('`', '`')} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-zinc-300 hover:bg-[#A3E635] hover:text-black transition-colors text-left border-b border-white/5 group">
                        <Type size={14} className="text-zinc-500 group-hover:text-black transition-colors" /> Código
                      </button>
                      <button type="button" onClick={() => insertText('```\n', '\n```')} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-zinc-300 hover:bg-[#A3E635] hover:text-black transition-colors text-left border-b border-white/5 group">
                        <ShieldAlert size={14} className="text-zinc-500 group-hover:text-black transition-colors" /> Bloque de código
                      </button>
                      <button type="button" onClick={() => insertText('\n| Columna 1 | Columna 2 |\n| :--- | :--- |\n| Celda 1 | Celda 2 |\n')} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-zinc-300 hover:bg-[#A3E635] hover:text-black transition-colors text-left group">
                        <Table size={14} className="text-zinc-500 group-hover:text-black transition-colors" /> Tabla
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <textarea 
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Cuerpo de texto..."
              rows={12}
              className="w-full bg-transparent p-4 text-white placeholder-white/20 focus:outline-none resize-none rounded-b-xl min-h-[200px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
            <button 
              onClick={() => router.back()}
              className="px-6 py-2 rounded-full border border-white/10 text-white/60 font-bold text-sm hover:bg-white/5 transition-all"
            >
              Guardar borrador
            </button>
            <button 
              onClick={handlePublish}
              disabled={!title.trim()}
              className={`px-8 py-2 rounded-full font-bold text-sm transition-all shadow-xl ${
                title.trim() 
                  ? 'bg-white text-black hover:bg-[#A3E635] transform hover:scale-105 active:scale-95' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              Publicar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
