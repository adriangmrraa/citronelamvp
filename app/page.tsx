import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Citronela — Cultivo Hidropónico',
  description: 'Plataforma de gestión de cultivos hidropónicos y marketplace',
};

// Cannabis leaf SVG — decorative
function LeafIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden>
      <path d="M32 2c-1 6-4 10-8 13 3-1 6-1 9 0-3 3-5 7-6 12 3-2 6-3 10-3-2 4-3 8-3 13 3-3 7-5 11-6-1 4-2 9-1 14-4-2-8-3-12-3 1 3 3 6 5 8-5-1-9-1-13 1 2-5 1-10-1-14-2 2-5 4-8 5 2-4 3-8 2-12-4 2-8 3-12 3 3-4 4-9 4-13-4 1-9 1-13 0 4-3 7-7 8-12 4 1 9 2 13 1-1-5 0-10 2-14 3 3 6 6 8 10 2-4 4-8 5-12z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07120b] text-zinc-100 overflow-x-hidden">
      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07120b]/70 border-b border-lime-400/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 via-green-500 to-emerald-700 flex items-center justify-center shadow-glow-lime group-hover:scale-110 transition-transform duration-300">
              <LeafIcon className="w-6 h-6 text-[#07120b]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-white">Citro</span>
              <span className="text-gradient-weed">nela</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-lime-300 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="relative px-5 py-2.5 rounded-xl font-semibold text-sm text-[#07120b] bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 hover:shadow-glow-lime hover:scale-105 active:scale-95 transition-all duration-300 animate-gradient-x"
            >
              Registro
            </Link>
          </nav>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Animated blobs */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute top-[-10%] left-[-5%] w-[520px] h-[520px] rounded-full bg-lime-500/25 blur-3xl animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-600/25 blur-3xl animate-blob [animation-delay:-4s]" />
          <div className="absolute bottom-[-10%] left-[30%] w-[480px] h-[480px] rounded-full bg-amber-500/15 blur-3xl animate-blob [animation-delay:-8s]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-weed opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] -z-0" />

        {/* Floating leaves */}
        <LeafIcon className="absolute top-24 left-10 w-24 h-24 text-lime-400/10 animate-float rotate-12" />
        <LeafIcon className="absolute top-40 right-16 w-32 h-32 text-emerald-400/10 animate-float-slow -rotate-12" />
        <LeafIcon className="absolute bottom-20 left-1/4 w-20 h-20 text-amber-400/10 animate-float [animation-delay:-2s]" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-32 text-center">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lime-400/30 bg-lime-400/5 backdrop-blur-sm mb-8 animate-fade-in">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-lime-400 opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-lime-400" />
            </span>
            <span className="text-xs sm:text-sm font-medium text-lime-300 tracking-wide uppercase">
              Plataforma de cultivo hidropónico
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6 animate-fade-in [animation-delay:100ms]">
            Cultivá tu propio{' '}
            <span className="relative inline-block">
              <span className="text-gradient-weed animate-gradient-x">ecosistema</span>
              <svg
                className="absolute -bottom-3 left-0 w-full h-3 text-lime-400/60"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <path d="M2 7 Q 50 -2 100 6 T 198 5" />
              </svg>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in [animation-delay:200ms]">
            La plataforma definitiva para gestionar tus cultivos hidropónicos.
            Registrá, monitoreá y hacé crecer tus plantas con control total —{' '}
            <span className="text-lime-300 font-medium">del esqueje a la cosecha</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in [animation-delay:300ms]">
            <Link
              href="/register"
              className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-[#07120b] bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 hover:shadow-glow-lime hover:scale-105 active:scale-95 transition-all duration-300 animate-gradient-x flex items-center justify-center gap-2"
            >
              Comenzar ahora
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base text-zinc-200 border border-zinc-700 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-800/60 hover:border-lime-400/40 hover:text-lime-300 transition-all duration-300"
            >
              Ya tengo cuenta
            </Link>
          </div>

          {/* Mini stats */}
          <div className="mt-20 grid grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-in [animation-delay:400ms]">
            {[
              { n: '150+', l: 'Cultivadores' },
              { n: '24/7', l: 'Monitoreo' },
              { n: '100%', l: 'Trazabilidad' },
            ].map((s) => (
              <div key={s.l} className="relative group">
                <div className="p-4 rounded-2xl border border-lime-400/10 bg-white/[0.02] backdrop-blur-sm group-hover:border-lime-400/30 group-hover:bg-lime-400/5 transition-all duration-300">
                  <div className="text-2xl sm:text-3xl font-black text-gradient-weed">{s.n}</div>
                  <div className="text-xs sm:text-sm text-zinc-500 uppercase tracking-wider mt-1">{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#07120b] via-[#0a1a10] to-[#07120b]">
        <div className="absolute inset-0 bg-grid-weed opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-xs font-semibold tracking-wider uppercase text-lime-300 mb-4">
              Features
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Todo lo que necesitás,{' '}
              <span className="text-gradient-weed">en un solo lugar</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Herramientas potentes, interfaz simple. Diseñado por cultivadores, para cultivadores.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {/* Card 1 — Cultivo */}
            <div className="group relative p-8 rounded-3xl border border-lime-400/15 bg-gradient-to-br from-lime-400/5 via-green-500/[0.03] to-transparent backdrop-blur-sm hover:border-lime-400/40 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-lime-400/10 blur-3xl group-hover:bg-lime-400/25 transition-all duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lime-300 to-green-600 flex items-center justify-center mb-6 shadow-glow-lime group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <span className="text-3xl">🌱</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Mi Cultivo</h3>
                <p className="text-zinc-400 leading-relaxed mb-5">
                  Registrá tus buckets hidropónicos y llevá un log semanal de pH, EC,
                  nutrientes y fases. IA que sugiere correcciones.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['pH/EC', 'Fases', 'IA'].map((t) => (
                    <span key={t} className="px-2.5 py-1 text-xs font-medium rounded-full bg-lime-400/10 text-lime-300 border border-lime-400/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 — Mercado */}
            <div className="group relative p-8 rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-400/5 via-teal-500/[0.03] to-transparent backdrop-blur-sm hover:border-emerald-400/40 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-emerald-400/10 blur-3xl group-hover:bg-emerald-400/25 transition-all duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-300 to-teal-600 flex items-center justify-center mb-6 shadow-glow-emerald group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <span className="text-3xl">🛒</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Mercado</h3>
                <p className="text-zinc-400 leading-relaxed mb-5">
                  Comprá y vendé genéticas, parafernalia y flores. Reseñas reales,
                  informes de laboratorio verificados.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Genéticas', 'Lab Reports', 'Reseñas'].map((t) => (
                    <span key={t} className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3 — Comunidad */}
            <div className="group relative p-8 rounded-3xl border border-amber-400/15 bg-gradient-to-br from-amber-400/5 via-yellow-500/[0.03] to-transparent backdrop-blur-sm hover:border-amber-400/40 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-amber-400/10 blur-3xl group-hover:bg-amber-400/25 transition-all duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-600 flex items-center justify-center mb-6 shadow-[0_10px_30px_-10px_rgba(251,191,36,0.55)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Comunidad</h3>
                <p className="text-zinc-400 leading-relaxed mb-5">
                  Compartí investigaciones, debates y papers. Aprendé de otros
                  cultivadores, eventos y clases.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Debates', 'Papers', 'Eventos'].map((t) => (
                    <span key={t} className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ECOSYSTEM BAND ============ */}
      <section className="relative py-20 border-y border-lime-400/10 bg-gradient-to-r from-[#07120b] via-[#0b2218] to-[#07120b] overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-lime-500/10 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-lime-400/70 mb-4">Un ecosistema completo</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-zinc-500">
            {['Hidroponía', 'Orgánico', 'Sales Minerales', 'Mixto', 'Lab Reports', 'Trazabilidad'].map((w, i) => (
              <span
                key={w}
                className="text-lg sm:text-xl font-semibold hover:text-lime-300 transition-colors duration-300 cursor-default"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-lime-500/20 blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/20 blur-3xl animate-blob [animation-delay:-5s]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex p-1 rounded-full bg-gradient-to-r from-lime-400 via-emerald-400 to-amber-400 animate-gradient-x mb-8">
            <div className="px-5 py-2 rounded-full bg-[#07120b] text-sm font-medium text-lime-300">
              🌿 Empezá gratis hoy
            </div>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Listo para{' '}
            <span className="text-gradient-weed">florecer</span>?
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
            Sumate a la comunidad de cultivadores que ya están llevando su cultivo al próximo nivel.
          </p>
          <Link
            href="/register"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg text-[#07120b] bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 hover:shadow-glow-lime hover:scale-105 active:scale-95 transition-all duration-300 animate-gradient-x"
          >
            Crear mi cuenta
            <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative border-t border-lime-400/10 bg-[#050d07] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-400 via-green-500 to-emerald-700 flex items-center justify-center">
                <LeafIcon className="w-5 h-5 text-[#07120b]" />
              </div>
              <span className="font-extrabold text-lg">
                <span className="text-white">Citro</span>
                <span className="text-gradient-weed">nela</span>
              </span>
            </div>
            <div className="flex gap-6 text-sm text-zinc-500">
              <Link href="/legal/terms" className="hover:text-lime-300 transition-colors">
                Términos
              </Link>
              <Link href="/legal/privacy" className="hover:text-lime-300 transition-colors">
                Privacidad
              </Link>
              <Link href="/login" className="hover:text-lime-300 transition-colors">
                Login
              </Link>
            </div>
            <p className="text-xs text-zinc-600">
              &copy; 2026 Citronela. Cultivado con 🌿
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
