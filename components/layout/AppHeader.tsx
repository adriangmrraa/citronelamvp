'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Leaf, LogOut, ChevronDown } from 'lucide-react';
import { useUserContext } from '@/context/UserContext';
import { useSearch } from '@/context/SearchContext';

const NAV_LINKS = [
  { href: '/profile', label: 'Mi Perfil' },
  { href: '/cultivo', label: 'Mi Cultivo' },
  { href: '/market', label: 'Market' },
  { href: '/foro', label: 'Foro' },
  { href: '/events', label: 'Eventos' },
];

export default function AppHeader() {
  const pathname = usePathname();
  const { username, tokens, logout } = useUserContext();
  const { searchTerm, setSearchTerm, isSearchActive, setIsSearchActive } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  // Dynamic branding based on route
  const getBranding = () => {
    if (pathname.includes('/market')) return { first: 'Citro', second: 'market', placeholder: 'Buscá en el mercado...' };
    if (pathname.includes('/foro')) return { first: 'Citro', second: 'foro', placeholder: 'Buscá en el foro...' };
    if (pathname.includes('/events')) return { first: 'Citro', second: 'events', placeholder: 'Buscá eventos...' };
    if (pathname.includes('/profile')) return { first: 'Citro', second: 'nela', placeholder: 'Buscá en tu actividad...' };
    return { first: 'Citro', second: 'cultivo', placeholder: 'Buscá en tus cultivos...' };
  };

  const brand = getBranding();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#A3E635] backdrop-blur supports-[backdrop-filter]:bg-[#A3E635]/95">
      <div className="max-w-[2000px] mx-auto px-6 md:px-12 h-[80px] flex items-center justify-between gap-4">
        {/* Branding & Search Container */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          {!isSearchActive ? (
            <Link href="/cultivo" className="group shrink-0">
              <div 
                style={{ fontFamily: 'var(--font-avigea)' }}
                className="text-3xl tracking-tight leading-none"
              >
                <span className="text-[#07120b] group-hover:text-black transition-colors duration-300">{brand.first}</span>
                <span className="text-white">{brand.second}</span>
              </div>
            </Link>
          ) : (
            <div className="flex-1 flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex-1 relative group max-w-md">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#07120b]/50 group-focus-within:text-[#07120b] transition-colors">
                  <span className="material-symbols-outlined text-lg font-bold">search</span>
                </div>
                <input 
                  autoFocus
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={brand.placeholder} 
                  className="w-full bg-white/30 border-2 border-[#07120b]/10 rounded-none py-2 pl-10 pr-4 text-base font-bold text-[#07120b] placeholder-[#07120b]/40 focus:outline-none focus:border-[#07120b]/30 focus:bg-white/40 transition-all"
                />
              </div>
              <button 
                onClick={() => {
                  setIsSearchActive(false);
                  setSearchTerm("");
                }}
                className="w-10 h-10 flex-shrink-0 rounded-full bg-[#07120b]/10 border-2 border-[#07120b]/10 flex items-center justify-center text-[#07120b] hover:bg-white/40 transition-all focus:outline-none"
              >
                <span className="material-symbols-outlined text-xl font-bold">close</span>
              </button>
            </div>
          )}

          {/* Nav desktop - Only show when search is inactive or on large screens */}
          {!isSearchActive && (
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 text-sm font-black uppercase tracking-widest transition-colors ${
                    isActive(href)
                      ? 'bg-[#07120b] text-[#A3E635] rounded-none shadow-sm'
                      : 'text-[#07120b]/70 hover:text-[#07120b] hover:bg-white/20 rounded-none'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Tokens hidden on desktop as they are shown in page headers */}

          {!isSearchActive && (
            <button 
              onClick={() => setIsSearchActive(true)}
              className="w-12 h-12 rounded-full bg-[#07120b] border-2 border-[#07120b] flex items-center justify-center text-[#A3E635] hover:bg-black hover:scale-105 transition-all duration-300 focus:outline-none shadow-lg shadow-black/10"
            >
              <span className="material-symbols-outlined text-2xl font-bold">search</span>
            </button>
          )}

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
