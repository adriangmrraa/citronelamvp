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
    // Fetch user from /api/auth/me
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/login');
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        router.push('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">Citronela</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">@{user?.username}</span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Bienvenido, {user?.username}
        </h2>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/crops"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="text-4xl mb-3">🌱</div>
            <h3 className="text-xl font-semibold mb-2">Mi Cultivo</h3>
            <p className="text-gray-600">Gestiona tus cultivos hidropónicos</p>
          </Link>
          <Link
            href="/market"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="text-4xl mb-3">🛒</div>
            <h3 className="text-xl font-semibold mb-2">Mercado</h3>
            <p className="text-gray-600">Explora y compra productos</p>
          </Link>
          <Link
            href="/community"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-xl font-semibold mb-2">Comunidad</h3>
            <p className="text-gray-600">Comparte y aprende</p>
          </Link>
        </div>

        {/* Stats */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Tu Cuenta</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tokens</p>
              <p className="text-2xl font-bold text-green-600">{user?.tokens}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Verificado</p>
              <p className="text-2xl font-bold">{user?.isVerified ? '✅' : '❌'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rol</p>
              <p className="text-2xl font-bold">{user?.role}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}