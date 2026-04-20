import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">Citronela</h1>
          <nav className="flex gap-4">
            <Link href="/login" className="text-green-700 hover:text-green-900">
              Login
            </Link>
            <Link href="/register" className="text-green-700 hover:text-green-900">
              Registro
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-green-900 mb-6">
          Cultiva tu propio ecosistema
        </h2>
        <p className="text-xl text-green-800 mb-8 max-w-2xl mx-auto">
          La plataforma definitiva para gestionar tus cultivos hidropónicos.
          Registra, monitoriza y hace crecer tus plantas.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Comenzar Ahora
          </Link>
          <Link
            href="/login"
            className="bg-white text-green-700 border border-green-300 px-8 py-3 rounded-lg hover:bg-green-50 transition"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Qué puedes hacer?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg">
              <div className="text-4xl mb-4">🌱</div>
              <h4 className="text-xl font-semibold mb-2">Mi Cultivo</h4>
              <p className="text-gray-600">
                Registra tus bucktes hidropónicos y lleva un registro semanal de pH, EC y nutrientes.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <div className="text-4xl mb-4">🛒</div>
              <h4 className="text-xl font-semibold mb-2">Mercado</h4>
              <p className="text-gray-600">
                Compra y vende productos relacionados con el cultivo.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <div className="text-4xl mb-4">👥</div>
              <h4 className="text-xl font-semibold mb-2">Comunidad</h4>
              <p className="text-gray-600">
                Comparte conocimientos, bertanya dudas y aprende de otros cultivadores.
              </p>
           17:           </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2026 Citronela. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}