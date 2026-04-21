import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Citronela - Cultivo Hidropónico',
  description: 'Plataforma de gestión de cultivos hidropónicos y marketplace',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🌿</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Citronela</h1>
          </div>
          <nav className="flex gap-3">
            <Link href="/login" className="text-gray-600 hover:text-green-600 font-medium transition-colors px-4 py-2">
              Login
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-green-600/25 transition-all font-medium">
              Registro
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-green-700">Plataforma de cultivo hidropónico</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Cultiva tu propio <span className="text-green-600">ecosistema</span>
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          La plataforma definitiva para gestionar tus cultivos hidropónicos.
          Registra, monitoriza y haz crecer tus plantas con total control.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-green-600/25 transition-all duration-300 font-medium text-lg"
          >
            Comenzar Ahora
          </Link>
          <Link
            href="/login"
            className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium text-lg"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </section>

{/* Features */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            ¿Qué puedes hacer?
          </h3>
          <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
            Todo lo que necesitás para tu cultivo en un solo lugar
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌱</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Mi Cultivo</h4>
              <p className="text-gray-600">
                Registrá tus buckets hidropónicos y lleva un registro semanal de pH, EC y nutrientes.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🛒</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Mercado</h4>
              <p className="text-gray-600">
                Comprá y vendé productos relacionados con el cultivo de forma segura.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="text-3xl">👥</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Comunidad</h4>
              <p className="text-gray-600">
                Compartí conocimientos, hacé preguntas y aprendé de otros cultivadores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white">🌿</span>
            </div>
            <span className="text-white font-bold text-xl">Citronela</span>
          </div>
          <p className="text-gray-400">&copy; 2026 Citronela. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}