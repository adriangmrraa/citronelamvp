'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  email: string | null;
  role: string;
  tokens: number;
  isVerified: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo mode - show sample user
    const demoUser: User = {
      id: 1,
      username: 'demo',
      email: 'demo@citronela.app',
      role: 'grower',
      tokens: 100,
      isVerified: true,
    };
    setUser(demoUser);
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🌿</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Citronela</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-700 font-medium">@{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
              title="Cerrar Sesión"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Hola, <span className="text-green-600">{user?.username}</span> 👋
          </h2>
          <p className="text-gray-500 text-lg">Accede a las secciones de tu cuenta</p>
        </div>

        {/* Quick Actions Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Link
            href="/crops"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Mi Cultivo</h3>
              <p className="text-gray-500">Gestiona tus cultivos hidropónicos, registra nutrientes y rastrea el progreso de cada planta</p>
              <div className="mt-5 flex items-center text-green-600 font-medium">
                <span>Ir a Mis Cultivos</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </Link>
          
          <Link
            href="/market"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🛒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Mercado</h3>
              <p className="text-gray-500">Explora semillas, nutrientes y equipamiento para tu cultivo</p>
              <div className="mt-5 flex items-center text-blue-600 font-medium">
                <span>Explorar Mercado</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </Link>
          
          <Link
            href="/community"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="h-2 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Comunidad</h3>
              <p className="text-gray-500">Comparte experiencias, aprende técnicas y conectá con otros growers</p>
              <div className="mt-5 flex items-center text-purple-600 font-medium">
                <span>Ver Comunidad</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Tu Cuenta</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.672 2.95 1.704M12 20c-1.11 0-2.08-.672-2.95-1.704M5 12c0-1.11.672-2.08 1.704-2.95M9 12c0 1.11.672 2.08 1.704 2.95M12 12c1.11 0 2.08-.672 2.95-1.704" /></svg>
                </div>
                <span className="text-sm text-gray-500">Tokens</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{user?.tokens}</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m5 2v9a2 2 0 002 2h4a2 2 0 002-2V10" /></svg>
                </div>
                <span className="text-sm text-gray-500">Email</span>
              </div>
              <p className="text-lg font-semibold text-gray-700">{user?.isVerified ? 'Verificado' : 'Pendiente'}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <span className="text-sm text-gray-500">Rol</span>
              </div>
              <p className="text-lg font-semibold text-gray-700 capitalize">{user?.role}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h10a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-sm text-gray-500">Miembro</span>
              </div>
              <p className="text-lg font-semibold text-gray-700">Demo</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}