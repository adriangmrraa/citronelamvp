'use client';

import { useState } from 'react';
import Link from 'next/link';

// Demo posts
const DEMO_POSTS = [
  { 
    id: 1, 
    title: 'Guía completa de nutrientes para floración', 
    category: 'Investigaciones', 
    content: 'En esta guía vamos a ver exactamente qué nutrientes necesita tu planta durante la fase de floración...',
    author: 'GrowerPro',
    likes: 45,
    comments: 12,
    isPinned: true,
  },
  { 
    id: 2, 
    title: 'Mi primer cultivo - Semana 4', 
    category: 'Clases', 
    content: 'Les comparto mi experiencia en mi primer cultivo. Estoy usando LED 300W y tierra orgánica...',
    author: 'Novato2024',
    likes: 23,
    comments: 8,
    isPinned: false,
  },
  { 
    id: 3, 
    title: '¿LED o HPS? Ventajas y desventajas', 
    category: 'Debates', 
    content: 'Vamos a discutir cuál es mejor para nuestro tipo de cultivo. Yo prefiero LED por el ahorro energético...',
    author: 'TechGrower',
    likes: 67,
    comments: 45,
    isPinned: false,
  },
  { 
    id: 4, 
    title: 'Papers: Efectos del pH en absorción', 
    category: 'Papers', 
    content: 'Resumen del estudio sobre cómo el pH afecta la absorción de nutrientes en plantas de cannabis...',
    author: 'Dr.Grow',
    likes: 89,
    comments: 15,
    isPinned: false,
  },
];

const CATEGORIES = ['Todas', 'Clases', 'Investigaciones', 'FAQ', 'Debates', 'Papers', 'Noticias'];

export default function CommunityPage() {
  const [posts] = useState(DEMO_POSTS);
  const [category, setCategory] = useState('Todas');
  const [showNewPost, setShowNewPost] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-green-600 hover:text-green-700">← Volver</Link>
            <h1 className="text-2xl font-bold text-green-800">👥 Comunidad</h1>
          </div>
          <button 
            onClick={() => setShowNewPost(!showNewPost)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            + Nueva Publicación
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
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />
            <textarea 
              placeholder="Escribe tu contenido..."
              className="w-full border rounded-lg px-4 py-2 mb-4 h-32"
            />
            <div className="flex justify-between items-center">
              <select className="border rounded-lg px-4 py-2">
                {CATEGORIES.filter(c => c !== 'Todas').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                Publicar
              </button>
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
                category === cat ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-green-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filtered.map(post => (
            <div key={post.id} className={`bg-white rounded-lg shadow p-6 ${post.isPinned ? 'border-l-4 border-green-500' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  {post.isPinned && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-2">📌 Fijo</span>}
                  <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                </div>
                <span className="text-sm text-gray-500">por {post.author}</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-green-600">
                  👍 {post.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-green-600">
                  💬 {post.comments} comentarios
                </button>
                <button className="flex items-center gap-1 hover:text-green-600">
                  🔖 Guardar
                </button>
                <button className="flex items-center gap-1 hover:text-green-600">
                  🔗 Compartir
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filtered.length > 0 && (
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