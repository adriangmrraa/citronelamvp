'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Demo posts
const DEMO_POSTS_INITIAL = [
  { 
    id: 1, 
    title: 'Guía completa de nutrientes para floración', 
    category: 'Investigaciones', 
    content: 'En esta guía vamos a ver exactamente qué nutrientes necesita tu planta durante la fase de floración. Los principales macronutrientes son nitrógeno, fósforo y potasio, pero también hay micronutrientes esenciales como calcio, magnesio y hierro.',
    author: 'GrowerPro',
    likes: 45,
    comments: 12,
    isPinned: true,
    createdAt: '2024-02-15',
    likedBy: [],
    savedBy: [],
  },
  { 
    id: 2, 
    title: 'Mi primer cultivo - Semana 4', 
    category: 'Clases', 
    content: 'Les comparto mi experiencia en mi primer cultivo. Estoy usando LED 300W y tierra orgánica. La planta va muy bien, ya tiene 20cm y las hojas se ven sanas. Cualquier pregunta, abajo!',
    author: 'Novato2024',
    likes: 23,
    comments: 8,
    isPinned: false,
    createdAt: '2024-02-10',
    likedBy: [],
    savedBy: [],
  },
  { 
    id: 3, 
    title: '¿LED o HPS? Ventajas y desventajas', 
    category: 'Debates', 
    content: 'Vamos a discutir cuál es mejor para nuestro tipo de cultivo. Yo prefiero LED por el ahorro energético y porque genera menos calor. Pero muchos dicen que HPS tiene mejor rendimiento en floración. Qué opinan?',
    author: 'TechGrower',
    likes: 67,
    comments: 45,
    isPinned: false,
    createdAt: '2024-02-08',
    likedBy: [],
    savedBy: [],
  },
  { 
    id: 4, 
    title: 'Papers: Efectos del pH en absorción de nutrientes', 
    category: 'Papers', 
    content: 'Resumen del estudio sobre cómo el pH afecta la absorción de nutrientes en plantas de cannabis. Rango óptimo: 6.0-6.5 en tierra. Fuera de este rango, las plantas no pueden absorbe determinados nutrientes, aunque estén presentes en el sustrato.',
    author: 'Dr.Grow',
    likes: 89,
    comments: 15,
    isPinned: false,
    createdAt: '2024-02-05',
    likedBy: [],
    savedBy: [],
  },
];

const CATEGORIES = ['Todas', 'Clases', 'Investigaciones', 'FAQ', 'Debates', 'Papers', 'Noticias'];

const STORAGE_KEY = 'citronela_posts';
const USER_KEY = 'citronela_user';

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [category, setCategory] = useState('Todas');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Clases' });
  const [currentUser, setCurrentUser] = useState<string>('UsuarioDemo');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const storedPosts = localStorage.getItem(STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(DEMO_POSTS_INITIAL);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_POSTS_INITIAL));
    }
    
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = category === 'Todas' ? posts : posts.filter(p => p.category === category);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Clases': return 'bg-blue-100 text-blue-800';
      case 'Investigaciones': return 'bg-purple-100 text-purple-800';
      case 'Debates': return 'bg-orange-100 text-orange-800';
      case 'Papers': return 'bg-gray-100 text-gray-800';
      case 'Noticias': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const createPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      showNotification('Completá título y contenido');
      return;
    }
    const post = {
      id: Date.now(),
      ...newPost,
      author: currentUser,
      likes: 0,
      comments: 0,
      isPinned: false,
      createdAt: new Date().toISOString().split('T')[0],
      likedBy: [],
      savedBy: [],
    };
    const updated = [post, ...posts];
    setPosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setShowNewPost(false);
    setNewPost({ title: '', content: '', category: 'Clases' });
    showNotification('Publicación creada');
  };

  const toggleLike = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const liked = post.likedBy?.includes(currentUser) || false;
    const updated = posts.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        likes: liked ? p.likes - 1 : p.likes + 1,
        likedBy: liked 
          ? p.likedBy.filter((u: string) => u !== currentUser)
          : [...(p.likedBy || []), currentUser]
      };
    });
    setPosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const isLiked = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    return post?.likedBy?.includes(currentUser) || false;
  };

  const toggleSave = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const saved = post.savedBy?.includes(currentUser) || false;
    const updated = posts.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        savedBy: saved 
          ? p.savedBy.filter((u: string) => u !== currentUser)
          : [...(p.savedBy || []), currentUser]
      };
    });
    setPosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showNotification(saved ? 'Eliminado de guardados' : 'Guardado');
  };

  const isSaved = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    return post?.savedBy?.includes(currentUser) || false;
  };

  const deletePost = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const post = posts.find(p => p.id === postId);
    if (post?.author !== currentUser) {
      showNotification('Solo podés eliminar tus publicaciones');
      return;
    }
    if (!confirm('¿Eliminar esta publicación?')) return;
    
    const updated = posts.filter(p => p.id !== postId);
    setPosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (selectedPost?.id === postId) setSelectedPost(null);
    showNotification('Publicación eliminada');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              <div className="flex items-center gap-2 mb-4">
                {selectedPost.isPinned && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">📌 Fijo</span>}
                <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(selectedPost.category)}`}>
                  {selectedPost.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
              <p className="text-sm text-gray-500 mb-4">por {selectedPost.author} • {formatDate(selectedPost.createdAt)}</p>
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
              </div>
              <div className="flex items-center gap-6 border-t pt-4">
                <button 
                  onClick={() => toggleLike(selectedPost.id)}
                  className={`flex items-center gap-2 ${isLiked(selectedPost.id) ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                >
                  {isLiked(selectedPost.id) ? '❤️' : '👍'} {selectedPost.likes}
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-green-600">
                  💬 {selectedPost.comments}
                </button>
                <button 
                  onClick={() => toggleSave(selectedPost.id)}
                  className={`flex items-center gap-2 ${isSaved(selectedPost.id) ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                >
                  {isSaved(selectedPost.id) ? '🔖' : '🔖 Guardar'}
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-green-600">
                  🔗 Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-green-600 transition-colors duration-200 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              <span className="text-sm font-medium">Volver</span>
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <h1 className="text-xl font-bold text-gray-800">Comunidad</h1>
          </div>
          <button 
            onClick={() => setShowNewPost(!showNewPost)}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl hover:from-green-700 hover:to-green-800 hover:shadow-lg hover:shadow-green-600/25 transition-all duration-300 flex items-center gap-2 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nueva Publicación
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* New Post Form */}
        {showNewPost && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Nueva Publicación</h3>
            <input 
              type="text" 
              placeholder="Título de tu publicación"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />
            <textarea 
              placeholder="Escribe tu contenido..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 mb-4 h-32"
            />
            <div className="flex justify-between items-center">
              <select 
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className="border rounded-lg px-4 py-2"
              >
                {CATEGORIES.filter(c => c !== 'Todas').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowNewPost(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={createPost}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                category === cat ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-green-50 border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Feed */}
        <div className="space-y-4 stagger-children">
          {filtered.map(post => (
            <div 
              key={post.id} 
              onClick={() => setSelectedPost(post)}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer overflow-hidden ${post.isPinned ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.isPinned && <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">📌 Fijo</span>}
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                  {post.author === currentUser && (
                    <button 
                      onClick={(e) => deletePost(post.id, e)}
                      className="w-8 h-8 bg-gray-50 hover:bg-red-50 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">{post.content}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-5">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                        isLiked(post.id) 
                          ? 'bg-green-100 text-green-700' 
                          : 'hover:bg-gray-100 text-gray-500 hover:text-green-600'
                      }`}
                    >
                      {isLiked(post.id) ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      )}
                      <span className="font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      <span className="font-medium">{post.comments}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500">No hay publicaciones en esta categoría</p>
          </div>
        )}

        {/* Load More - Visual only for demo */}
        {filtered.length > 0 && category !== 'Todas' && (
          <div className="text-center mt-8">
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg border border-green-600 hover:bg-green-50">
              Cargar más publicaciones
            </button>
          </div>
        )}
      </main>
    </div>
  );
}