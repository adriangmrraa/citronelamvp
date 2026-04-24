'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Leaf, LogOut, ChevronDown } from 'lucide-react';
import NotificationBell from '@/components/shared/NotificationBell';

const NAV_LINKS = [
  { href: '/cultivo', label: 'Mi Cultivo' },
  { href: '/market', label: 'Marketplace' },
  { href: '/community', label: 'Comunidad' },
  { href: '/events', label: 'Eventos' },
];

export default function AppHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07120b]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 group cursor-pointer shrink-0"
          >
            <div className="relative w-8 h-8 filter drop-shadow-[0_0_8px_rgba(163,230,53,0.3)] group-hover:scale-105 transition-transform">
              <Image 
                src="/images/citrologoficial.svg" 
                alt="Citronela" 
                fill 
                className="object-contain" 
              />
            </div>
            <div 
              style={{ fontFamily: 'var(--font-avigea)' }}
              className="text-xl tracking-wide flex items-center"
            >
              <span className="text-lime-400 group-hover:text-lime-300 transition-colors duration-300">Citro</span><span className="text-white">nela</span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? 'bg-lime-400/10 text-lime-400 rounded-lg'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] rounded-lg'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: Bell + User */}
          <div className="flex items-center gap-2">
            <NotificationBell />

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.05] transition-colors text-sm font-medium text-zinc-300"
              >
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-lime-400 to-green-600 text-[#07120b] text-xs font-bold flex items-center justify-center">
                  U
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 glass-surface rounded-xl shadow-xl shadow-black/40 py-1 z-50">
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-white/[0.05]"
                  >
                    Mi perfil
                  </Link>
                  <hr className="my-1 border-white/[0.06]" />
                  <Link
                    href="/api/auth/logout"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Cerrar sesión
                  </Link>
                </div>
              )}
            </div>

            {/* Hamburger mobile */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-xl hover:bg-white/[0.05] transition-colors"
              aria-label="Menú"
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-zinc-300" />
              ) : (
                <Menu className="w-5 h-5 text-zinc-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#07120b]/95 backdrop-blur-xl px-4 pb-4 pt-2 space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-lime-400/10 text-lime-400'
                  : 'text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200'
              }`}
            >
              {label}
            </Link>
          ))}
          <hr className="border-white/[0.06] my-2" />
          <Link
            href="/profile"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
          >
            Mi perfil
          </Link>
          <Link
            href="/api/auth/logout"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Link>
        </div>
      )}
    </header>
  );
}
