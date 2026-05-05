'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, MessageSquare, Shield, Cpu, Globe } from 'lucide-react';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#07120b] border-t border-white/5 pt-12 pb-8 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 space-y-4">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-500">
                <Image 
                  src="/images/citrologoficial.svg" 
                  alt="Citronela" 
                  fill 
                  className="object-contain filter brightness-0 invert opacity-80" 
                />
              </div>
              <div 
                style={{ fontFamily: 'var(--font-avigea)' }}
                className="text-xl tracking-wider"
              >
                <span className="text-[#A3E635]">Citro</span><span className="text-white">nela</span>
                <span className="text-[10px] ml-1 text-white/30 align-top">2026</span>
              </div>
            </Link>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="text-zinc-500 hover:text-[#A3E635] transition-colors"><Instagram className="w-5 h-5" /></Link>
              <Link href="#" className="text-zinc-500 hover:text-[#A3E635] transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="text-zinc-500 hover:text-[#A3E635] transition-colors"><MessageSquare className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 col-span-1 md:col-span-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest opacity-50">Ecosistema</h4>
              <ul className="space-y-2">
                <li><Link href="/market" className="text-sm text-zinc-400 hover:text-white transition-colors">CitroMarket</Link></li>
                <li><Link href="/cultivo" className="text-sm text-zinc-400 hover:text-white transition-colors">Mis Cultivos</Link></li>
                <li><Link href="/foro" className="text-sm text-zinc-400 hover:text-white transition-colors">Comunidad</Link></li>
                <li><Link href="/events" className="text-sm text-zinc-400 hover:text-white transition-colors">Eventos</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest opacity-50">Soporte</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Guías de Cultivo</Link></li>
                <li><Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Reglas del Mercado</Link></li>
                <li><Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Seguridad</Link></li>
                <li><Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-zinc-600 tracking-wide">
            © {currentYear} CITRONELA LABS. ALL RIGHTS RESERVED. GROW TOGETHER.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
