'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Leaf, LogOut, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { href: '/cultivo', label: 'Mi Cultivo' },
  { href: '/market', label: 'CitroMarket' },
  { href: '/community', label: 'Foro' },
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
    <header className="sticky top-0 z-40 w-full bg-[#A3E635] border-b border-[#07120b]/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 group cursor-pointer shrink-0"
          >
            <div className="relative w-8 h-8 filter drop-shadow-[0_0_8px_rgba(7,18,11,0.2)] group-hover:scale-105 transition-transform">
              <Image 
                src="/images/citrologoficial.svg" 
                alt="Citronela" 
                fill 
                className="object-contain brightness-0" 
              />
            </div>
            <div 
              style={{ fontFamily: 'var(--font-avigea)' }}
              className="text-xl tracking-wide flex items-center"
            >
              <span className="text-[#07120b] group-hover:text-black transition-colors duration-300">Citro</span><span className="text-white">nela</span>
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
                    ? 'bg-[#07120b]/10 text-[#07120b] rounded-none'
                    : 'text-[#07120b]/70 hover:text-[#07120b] hover:bg-white/20 rounded-none'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: User */}
          <div className="flex items-center gap-2">

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-none hover:bg-white/20 transition-colors text-sm font-medium text-[#07120b]"
              >
                <span className="w-6 h-6 rounded-none bg-[#07120b] text-[#A3E635] text-xs font-bold flex items-center justify-center">
                  U
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#07120b]/50" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-none shadow-xl shadow-black/20 py-1 z-50">
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                  >
                    Mi perfil
                  </Link>
                  <hr className="my-1 border-zinc-100" />
                  <Link
                    href="/api/auth/logout"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
              className="md:hidden p-2 rounded-none hover:bg-white/20 transition-colors"
              aria-label="Menú"
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-[#07120b]" />
              ) : (
                <Menu className="w-5 h-5 text-[#07120b]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#07120b]/10 bg-[#A3E635] px-4 pb-4 pt-2 space-y-1 shadow-inner">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-none text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-[#07120b]/10 text-[#07120b]'
                  : 'text-[#07120b]/70 hover:bg-white/20 hover:text-[#07120b]'
              }`}
            >
              {label}
            </Link>
          ))}
          <hr className="border-[#07120b]/10 my-2" />
          <Link
            href="/profile"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2.5 rounded-none text-sm text-[#07120b]/70 hover:bg-white/20 hover:text-[#07120b]"
          >
            Mi perfil
          </Link>
          <Link
            href="/api/auth/logout"
            className="flex items-center gap-2 px-3 py-2.5 rounded-none text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Link>
        </div>
      )}
    </header>
  );
}
